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
  critical: "#dc2626",
  high: "#d97706",
  moderate: "#eab308",
  low: "#2563eb",
};

export const incidents: Incident[] = [
  {
    id: "INC-4471",
    title: "Waterlogging near Sabarmati Riverfront, 4 stranded",
    type: "Flood",
    lat: 23.041,
    lng: 72.569,
    priority: "critical",
    district: "Sabarmati Riverfront",
    people: 4,
    minutesAgo: 3,
  },
  {
    id: "INC-4470",
    title: "Fallen tree blocking SG Highway near ISCON mega-mall",
    type: "Infrastructure",
    lat: 23.029,
    lng: 72.507,
    priority: "high",
    district: "SG Highway",
    people: 26,
    minutesAgo: 7,
  },
  {
    id: "INC-4468",
    title: "Stranded citizens near Maninagar Railway Station",
    type: "Rescue",
    lat: 22.999,
    lng: 72.612,
    priority: "critical",
    district: "Maninagar",
    people: 60,
    minutesAgo: 11,
  },
  {
    id: "INC-4465",
    title: "Power line down, sparking near Navrangpura",
    type: "Utility",
    lat: 23.036,
    lng: 72.539,
    priority: "moderate",
    district: "Navrangpura",
    people: 8,
    minutesAgo: 18,
  },
  {
    id: "INC-4462",
    title: "Medical aid required at Paldi crossing",
    type: "Medical",
    lat: 23.015,
    lng: 72.567,
    priority: "high",
    district: "Paldi",
    people: 2,
    minutesAgo: 23,
  },
  {
    id: "INC-4459",
    title: "Shelter at capacity, Satellite area",
    type: "Logistics",
    lat: 23.026,
    lng: 72.51,
    priority: "low",
    district: "Satellite",
    people: 140,
    minutesAgo: 34,
  },
  {
    id: "INC-4455",
    title: "Wall collapse near Bopal approach road",
    type: "Structural",
    lat: 23.018,
    lng: 72.463,
    priority: "high",
    district: "Bopal",
    people: 12,
    minutesAgo: 41,
  },
  {
    id: "INC-4451",
    title: "Water contamination alert, Vasna ward",
    type: "Public Health",
    lat: 23.008,
    lng: 72.553,
    priority: "moderate",
    district: "Vasna",
    people: 300,
    minutesAgo: 52,
  },
];

export const feed: FeedPost[] = [
  {
    id: "F-9012",
    source: "X",
    handle: "@amdavad_watch",
    body: "Water rising fast near Sabarmati Riverfront, people stranded on walkway.",
    priority: "critical",
    minutesAgo: 1,
    confidence: 92,
  },
  {
    id: "F-9011",
    source: "Emergency Line",
    handle: "Call 4471",
    body: "Caller reports tree fallen on SG Highway near ISCON, traffic completely blocked.",
    priority: "critical",
    minutesAgo: 3,
    confidence: 98,
  },
  {
    id: "F-9010",
    source: "Sensor Grid",
    handle: "Node SBR-08",
    body: "River level sensors above threshold near Sabarmati, 6 consecutive readings.",
    priority: "high",
    minutesAgo: 6,
    confidence: 87,
  },
  {
    id: "F-9009",
    source: "Citizen App",
    handle: "user_2841",
    body: "Elderly neighbour needs oxygen supply in Maninagar, lift not working, 5th floor.",
    priority: "high",
    minutesAgo: 9,
    confidence: 74,
  },
  {
    id: "F-9008",
    source: "Field Radio",
    handle: "Unit 12",
    body: "Access road via Bopal blocked by debris, rerouting convoy through South Bopal.",
    priority: "moderate",
    minutesAgo: 14,
    confidence: 95,
  },
  {
    id: "F-9007",
    source: "X",
    handle: "@relief_now",
    body: "Satellite shelter almost full, need blankets and dry rations by evening.",
    priority: "low",
    minutesAgo: 21,
    confidence: 68,
  },
  {
    id: "F-9006",
    source: "Citizen App",
    handle: "user_1190",
    body: "Sparking cable hanging over footpath outside Navrangpura bus stop.",
    priority: "moderate",
    minutesAgo: 27,
    confidence: 81,
  },
];
