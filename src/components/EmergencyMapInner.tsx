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
  showResources?: boolean;
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
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18v-3.14a2 2 0 0 0-.59-1.41L10.7 11"/><path d="M14 3v4h4l3 4v5"/><circle cx="8.5" cy="19" r="2"/><circle cx="17.5" cy="19" r="2"/><path d="M14 11H8"/><path d="m7 11-3 4v3h12v-4l-2.5-4"/></svg>',
  Boat: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/></svg>',
  Helicopter:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2.56 0-4.41-2.06-5-4.5C6.1 4.5 8.2 3 12 3s5.9 1.5 5 4.5c-.59 2.44-2.44 4.5-5 4.5z"/><path d="M12 12v9"/><path d="M6 15l6-3 6 3"/><path d="M18 15v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3"/></svg>',
  "Supply Truck":
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
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
  showResources = true,
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
      style={{ background: "#000000" }}
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
      {showResources &&
        liveResources.map((r) => (
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
          radius={i.priority === "critical" ? 16 : i.priority === "high" ? 13 : 10}
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
