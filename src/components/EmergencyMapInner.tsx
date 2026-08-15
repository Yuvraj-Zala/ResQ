import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { incidents, priorityColor, priorityLabel } from "@/lib/incidents";
import { statusColor, statusLabel, type IncidentStatus } from "@/lib/ops";
import type { SimPost } from "@/lib/simulator";

export interface MapProps {
  posts?: SimPost[];
  statusOf?: (post: SimPost) => IncidentStatus;
  selectedId?: string | null;
  onSelect?: (post: SimPost) => void;
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 15, { duration: 1.1 });
  }, [target, map]);
  return null;
}

export default function EmergencyMapClient({
  posts = [],
  statusOf,
  selectedId = null,
  onSelect,
}: MapProps) {
  const selected = posts.find((p) => p.id === selectedId) ?? null;

  return (
    <MapContainer
      center={[19.066, 72.874]}
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
            <div style={{ minWidth: 180 }}>
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
              <div style={{ minWidth: 190 }}>
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
