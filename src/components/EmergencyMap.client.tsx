import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { incidents, priorityColor, priorityLabel } from "@/lib/incidents";

export default function EmergencyMapClient() {
  return (
    <MapContainer
      center={[19.066, 72.874]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "transparent" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
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
    </MapContainer>
  );
}
