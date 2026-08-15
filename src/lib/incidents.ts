export type Priority = "critical" | "high" | "moderate" | "low";

export interface Incident {
  id: string;
  title: string;
  type: string;
  lat: number;
  lng: number;
  priority: Priority;
  district: string;
  people: number;
  minutesAgo: number;
}

export interface FeedPost {
  id: string;
  source: "X" | "Emergency Line" | "Field Radio" | "Citizen App" | "Sensor Grid";
  handle: string;
  body: string;
  priority: Priority;
  minutesAgo: number;
  confidence: number;
}

export const priorityLabel: Record<Priority, string> = {
  critical: "Critical",
  high: "High",
  moderate: "Moderate",
  low: "Low",
};

export const priorityColor: Record<Priority, string> = {
  critical: "#ff4d4d",
  high: "#ff9f1a",
  moderate: "#ffd93d",
  low: "#39d98a",
};

export const incidents: Incident[] = [
  { id: "INC-4471", title: "Building collapse, 4 trapped", type: "Structural", lat: 19.0760, lng: 72.8777, priority: "critical", district: "Fort", people: 4, minutesAgo: 3 },
  { id: "INC-4470", title: "Flash flooding, road impassable", type: "Flood", lat: 19.0896, lng: 72.8656, priority: "high", district: "Dadar", people: 26, minutesAgo: 7 },
  { id: "INC-4468", title: "Gas leak reported near market", type: "Hazmat", lat: 19.0330, lng: 72.8570, priority: "critical", district: "Worli", people: 60, minutesAgo: 11 },
  { id: "INC-4465", title: "Power line down, sparking", type: "Utility", lat: 19.1136, lng: 72.8697, priority: "moderate", district: "Andheri", people: 8, minutesAgo: 18 },
  { id: "INC-4462", title: "Medical evac requested", type: "Medical", lat: 19.0176, lng: 72.8562, priority: "high", district: "Mahim", people: 2, minutesAgo: 23 },
  { id: "INC-4459", title: "Shelter at capacity", type: "Logistics", lat: 19.1197, lng: 72.9051, priority: "low", district: "Powai", people: 140, minutesAgo: 34 },
  { id: "INC-4455", title: "Landslide blocking access road", type: "Geological", lat: 19.0500, lng: 72.9000, priority: "high", district: "Chembur", people: 12, minutesAgo: 41 },
  { id: "INC-4451", title: "Water contamination alert", type: "Public Health", lat: 19.0640, lng: 72.8330, priority: "moderate", district: "Bandra", people: 300, minutesAgo: 52 },
];

export const feed: FeedPost[] = [
  { id: "F-9012", source: "X", handle: "@mumbai_watch", body: "Water rising fast near Dadar station, buses stuck. People climbing onto roofs.", priority: "critical", minutesAgo: 1, confidence: 92 },
  { id: "F-9011", source: "Emergency Line", handle: "Call 4471", body: "Caller reports partial collapse of 3-storey building, hearing voices inside.", priority: "critical", minutesAgo: 3, confidence: 98 },
  { id: "F-9010", source: "Sensor Grid", handle: "Node WRL-08", body: "Methane concentration above threshold for 6 consecutive readings.", priority: "high", minutesAgo: 6, confidence: 87 },
  { id: "F-9009", source: "Citizen App", handle: "user_2841", body: "Elderly neighbour needs oxygen supply, lift not working, 7th floor.", priority: "high", minutesAgo: 9, confidence: 74 },
  { id: "F-9008", source: "Field Radio", handle: "Unit 12", body: "Access road via Chembur blocked by debris, rerouting convoy north.", priority: "moderate", minutesAgo: 14, confidence: 95 },
  { id: "F-9007", source: "X", handle: "@relief_now", body: "Powai shelter almost full, need blankets and dry rations by evening.", priority: "low", minutesAgo: 21, confidence: 68 },
  { id: "F-9006", source: "Citizen App", handle: "user_1190", body: "Sparking cable hanging over footpath outside Andheri metro gate 3.", priority: "moderate", minutesAgo: 27, confidence: 81 },
];
