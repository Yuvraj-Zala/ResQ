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

  return (
    <MapContainer
      center={[23.0225, 72.5714]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#1d1d1f" }}
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
              color: "#0066cc",
              fillColor: "#0066cc",
              fillOpacity: 0.12,
              weight: 1,
              dashArray: "6 4",
            }}
          >
            <Popup>
              <div style={{ minWidth: 150, fontFamily: "monospace", fontSize: "11px" }}>
                <strong style={{ color: "#2997ff" }}>
                  FLOOD RISK ZONE {String.fromCharCode(65 + i)}
                </strong>
                <div style={{ opacity: 0.7, marginTop: "4px" }}>
                  Sabarmati river basin inundation sector
                </div>
              </div>
            </Popup>
          </Polygon>
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
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
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
                  <div style={{ marginTop: "5px", color: "#2997ff", fontSize: "10px" }}>
                    📍 {p.locationDetected}
                  </div>
                )}

                {p.recommendedAction && (
                  <div
                    style={{
                      marginTop: "4px",
                      padding: "4px",
                      background: "rgba(0, 102, 204, 0.12)",
                      borderRadius: "4px",
                      border: "1px solid rgba(0, 102, 204, 0.25)",
                      fontSize: "9px",
                    }}
                  >
                    <span style={{ color: "#2997ff", fontWeight: "bold" }}>ACTION: </span>
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
                      color: "#f59e0b",
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
