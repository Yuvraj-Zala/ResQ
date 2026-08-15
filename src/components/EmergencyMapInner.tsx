import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polygon } from "react-leaflet";
import { incidents, priorityColor, priorityLabel } from "@/lib/incidents";
import { statusColor, statusLabel, type IncidentStatus } from "@/lib/ops";
import type { SimPost } from "@/lib/simulator";

export interface MapProps {
  posts?: SimPost[];
  statusOf?: (post: SimPost) => IncidentStatus;
  selectedId?: string | null;
  onSelect?: (post: SimPost) => void;
  showFloodZones?: boolean;
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 15, { duration: 1.1 });
  }, [target, map]);
  return null;
}

const floodZones: [number, number][][] = [
  [
    [23.0550, 72.5750],
    [23.0550, 72.5900],
    [23.0350, 72.5900],
    [23.0350, 72.5750],
  ],
  [
    [23.0250, 72.5550],
    [23.0250, 72.5800],
    [22.9950, 72.5800],
    [22.9950, 72.5550],
  ],
  [
    [23.0100, 72.5900],
    [23.0100, 72.6200],
    [22.9850, 72.6200],
    [22.9850, 72.5900],
  ],
];

export default function EmergencyMapClient({
  posts = [],
  statusOf,
  selectedId = null,
  onSelect,
  showFloodZones = false,
}: MapProps) {
  const selected = posts.find((p) => p.id === selectedId) ?? null;

  return (
    <MapContainer
      center={[23.0225, 72.5714]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "transparent" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <FlyTo target={selected ? [selected.lat, selected.lng] : null} />

      {showFloodZones &&
        floodZones.map((zone, i) => (
          <Polygon
            key={`flood-${i}`}
            positions={zone}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.15,
              weight: 1,
              dashArray: "4 2",
            }}
          >
            <Popup>
              <div style={{ minWidth: 140 }}>
                <strong>FLOOD RISK ZONE {String.fromCharCode(65 + i)}</strong>
                <div style={{ opacity: 0.7 }}>Sabarmati basin · high-risk inundation area</div>
              </div>
            </Popup>
          </Polygon>
        ))}

      {incidents.map((i) => (
        <CircleMarker
          key={i.id}
          center={[i.lat, i.lng]}
          radius={i.priority === "critical" ? 12 : i.priority === "high" ? 10 : 8}
          pathOptions={{
            color: priorityColor[i.priority],
            fillColor: priorityColor[i.priority],
            fillOpacity: 0.35,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ minWidth: 180, fontFamily: "monospace", fontSize: "11px" }}>
              <strong>{i.id}</strong> · {priorityLabel[i.priority]}
              <div>{i.title}</div>
              <div style={{ opacity: 0.7 }}>
                {i.district} · {i.people} affected · {i.minutesAgo}m ago
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {posts.map((p) => {
        const status = statusOf?.(p) ?? "new";
        const color = status === "new" ? priorityColor[p.priority] : statusColor[status];
        const active = p.id === selectedId;
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={active ? 13 : 9}
            eventHandlers={{ click: () => onSelect?.(p) }}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: active ? 0.75 : 0.45,
              weight: active ? 4 : 2,
            }}
          >
            <Popup>
              <div style={{ minWidth: 190, fontFamily: "monospace", fontSize: "11px" }}>
                <strong>{p.id}</strong> · {p.category}
                <div>{p.body}</div>
                <div style={{ opacity: 0.7 }}>
                  {statusLabel[status]} · conf {p.confidence}%
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
