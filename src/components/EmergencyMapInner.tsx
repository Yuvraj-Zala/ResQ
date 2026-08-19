import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  Polygon,
  Marker,
} from "react-leaflet";
import { divIcon } from "leaflet";
import { incidents, priorityColor, priorityLabel } from "@/lib/incidents";
import { statusColor, statusLabel, type IncidentStatus } from "@/lib/ops";
import { facilities, type FacilityType } from "@/lib/facilities";
import { resources, resourceStatusColor, type ResourceType } from "@/lib/resources";
import type { SimPost } from "@/lib/simulator";

export interface MapProps {
  posts?: SimPost[];
  statusOf?: (post: SimPost) => IncidentStatus;
  selectedId?: string | null;
  onSelect?: (post: SimPost) => void;
  showFloodZones?: boolean;
  mapFocus?: [number, number] | null;
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 14, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

const floodZones: [number, number][][] = [
  [
    [23.055, 72.575],
    [23.055, 72.59],
    [23.035, 72.59],
    [23.035, 72.575],
  ],
  [
    [23.025, 72.555],
    [23.025, 72.58],
    [22.995, 72.58],
    [22.995, 72.555],
  ],
  [
    [23.01, 72.59],
    [23.01, 72.62],
    [22.985, 72.62],
    [22.985, 72.59],
  ],
];

const hospitalIcon = divIcon({
  className: "rescuai-facility-icon",
  html: `<div style="
    width: 26px; height: 26px; border-radius: 50%;
    background: #2563eb; border: 2px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.45), 0 2px 6px rgba(0,0,0,0.5);
  ">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="#ffffff"/>
    </svg>
  </div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -16],
});

const shieldIcon = divIcon({
  className: "rescuai-facility-icon",
  html: `<div style="
    width: 24px; height: 28px;
    background: #16a34a; border: 2px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.35), 0 2px 6px rgba(0,0,0,0.5);
    border-radius: 4px 4px 6px 6px;
  ">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="#ffffff"/>
    </svg>
  </div>`,
  iconSize: [24, 28],
  iconAnchor: [12, 14],
  popupAnchor: [0, -18],
});

function facilityIconFor(type: FacilityType) {
  return type === "Hospital" ? hospitalIcon : shieldIcon;
}

const resourceTypeSvgs: Record<ResourceType, string> = {
  Ambulance:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17h1.5l2-7h10l2 7H21" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><circle cx="7.5" cy="18.5" r="1.5" fill="#fff"/><circle cx="16.5" cy="18.5" r="1.5" fill="#fff"/><path d="M5 17v-4l3-5h4l3 5v4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  Boat: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M8 15V8l4-3 4 3v7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  Helicopter:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="8" y="10" width="8" height="5" rx="2" stroke="#fff" stroke-width="1.5"/><path d="M4 10h16M12 10V7M12 15v3" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
  "Supply Truck":
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="8" width="12" height="9" rx="1" stroke="#fff" stroke-width="1.5"/><path d="M14 11h4l3 3v3h-7V11z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18.5" r="1.5" fill="#fff"/><circle cx="17" cy="18.5" r="1.5" fill="#fff"/></svg>',
};

function resourceIcon(type: ResourceType, status: string) {
  const bg = resourceStatusColor[status as keyof typeof resourceStatusColor] ?? "#6b7280";
  const svg = resourceTypeSvgs[type];
  return divIcon({
    className: "resq-resource-icon",
    html: `<div style="
      width: 30px; height: 30px; border-radius: 6px;
      background: ${bg}; border: 2px solid rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 0 2px ${bg}44, 0 2px 6px rgba(0,0,0,0.5);
    ">${svg}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

export default function EmergencyMapClient({
  posts = [],
  statusOf,
  selectedId = null,
  onSelect,
  showFloodZones = false,
  mapFocus = null,
}: MapProps) {
  const selected = posts.find((p) => p.id === selectedId) ?? null;
  const flyTarget = selected ? ([selected.lat, selected.lng] as [number, number]) : mapFocus;

  const [liveResources, setLiveResources] = useState(resources);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveResources((prev) =>
        prev.map((r) => {
          if (r.status !== "Dispatched") return r;
          return {
            ...r,
            lat: r.lat + (Math.random() - 0.5) * 0.0004,
            lng: r.lng + (Math.random() - 0.5) * 0.0004,
          };
        }),
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <MapContainer
      center={[23.0225, 72.5714]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#0B1117" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <FlyTo target={flyTarget} />

      {showFloodZones &&
        floodZones.map((zone, i) => (
          <Polygon
            key={`flood-${i}`}
            positions={zone}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#2563eb",
              fillOpacity: 0.12,
              weight: 1,
              dashArray: "6 4",
            }}
          >
            <Popup>
              <div style={{ minWidth: 150, fontFamily: "monospace", fontSize: "11px" }}>
                <strong style={{ color: "#3b82f6" }}>
                  FLOOD RISK ZONE {String.fromCharCode(65 + i)}
                </strong>
                <div style={{ opacity: 0.7, marginTop: "4px" }}>
                  Sabarmati river basin inundation sector
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

      {/* Hospitals & Relief Centers */}
      {facilities.map((f) => (
        <Marker key={f.id} position={[f.lat, f.lng]} icon={facilityIconFor(f.type)}>
          <Popup>
            <div style={{ minWidth: 190, fontFamily: "monospace", fontSize: "11px" }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <strong>{f.name}</strong>
                <span
                  style={{
                    color: "#3b82f6",
                    textTransform: "uppercase",
                    fontSize: "9px",
                    fontWeight: "bold",
                  }}
                >
                  {f.type}
                </span>
              </div>
              <div
                style={{
                  marginTop: "6px",
                  padding: "4px",
                  background: "rgba(37, 99, 235, 0.1)",
                  borderRadius: "4px",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  fontSize: "10px",
                }}
              >
                <span style={{ color: "#3b82f6", fontWeight: "bold" }}>BEDS: </span>
                {f.bedsAvailable}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Resource Tracking Markers */}
      {liveResources.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={resourceIcon(r.type, r.status)}>
          <Popup>
            <div style={{ minWidth: 180, fontFamily: "monospace", fontSize: "11px" }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <strong>{r.name}</strong>
                <span
                  style={{
                    color: resourceStatusColor[r.status],
                    textTransform: "uppercase",
                    fontSize: "9px",
                    fontWeight: "bold",
                  }}
                >
                  {r.status}
                </span>
              </div>
              <div
                style={{
                  marginTop: "6px",
                  padding: "4px",
                  background: `${resourceStatusColor[r.status]}11`,
                  borderRadius: "4px",
                  border: `1px solid ${resourceStatusColor[r.status]}33`,
                  fontSize: "10px",
                  color: resourceStatusColor[r.status],
                  fontWeight: 500,
                }}
              >
                {r.type}
              </div>
              <div style={{ marginTop: "4px", opacity: 0.7, fontSize: "10px" }}>{r.id}</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Verified City Incidents */}
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
            <div style={{ minWidth: 190, fontFamily: "monospace", fontSize: "11px" }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <strong>{i.id}</strong>
                <span
                  style={{
                    color: priorityColor[i.priority],
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                >
                  {priorityLabel[i.priority]}
                </span>
              </div>
              <div style={{ marginTop: "4px", fontWeight: 500 }}>{i.title}</div>
              <div style={{ opacity: 0.75, marginTop: "4px", fontSize: "10px" }}>
                Sector: {i.district} · {i.people} affected · {i.minutesAgo}m ago
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Live AI Classified Stream Posts */}
      {posts.map((p) => {
        const status = statusOf?.(p) ?? "new";
        const color = status === "new" ? priorityColor[p.priority] : statusColor[status];
        const active = p.id === selectedId;
        const categoryDisplay = p.aiCategory || p.category;

        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={active ? 14 : p.priority === "critical" ? 11 : 9}
            eventHandlers={{ click: () => onSelect?.(p) }}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: active ? 0.85 : 0.5,
              weight: active ? 4 : 2,
            }}
          >
            <Popup>
              <div style={{ minWidth: 220, fontFamily: "monospace", fontSize: "11px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
                    paddingBottom: "3px",
                  }}
                >
                  <strong>{p.id}</strong>
                  <span
                    style={{
                      color,
                      textTransform: "uppercase",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    {categoryDisplay}
                  </span>
                </div>

                <div style={{ marginTop: "6px", fontSize: "11px", lineHeight: "1.4" }}>
                  {p.body}
                </div>

                {p.locationDetected && (
                  <div style={{ marginTop: "5px", color: "#3b82f6", fontSize: "10px" }}>
                    {p.locationDetected}
                  </div>
                )}

                {p.recommendedAction && (
                  <div
                    style={{
                      marginTop: "4px",
                      padding: "4px",
                      background: "rgba(37, 99, 235, 0.1)",
                      borderRadius: "4px",
                      border: "1px solid rgba(37, 99, 235, 0.2)",
                      fontSize: "9px",
                    }}
                  >
                    <span style={{ color: "#3b82f6", fontWeight: "bold" }}>ACTION: </span>
                    {p.recommendedAction}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "6px",
                    fontSize: "9px",
                    opacity: 0.8,
                  }}
                >
                  <span>Status: {statusLabel[status]}</span>
                  <span>AI Conf: {p.confidence}%</span>
                </div>

                {p.fake && (
                  <div
                    style={{
                      marginTop: "4px",
                      color: "#d97706",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    ⚠️ Misinformation Warning
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
