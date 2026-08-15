import type { Priority } from "./incidents";
import {
  classifyDisasterPost,
  mockClassifyDisasterPost,
  mapAICategoryToLegacy,
  mapAISeverityToPriority,
  type AICategory,
  type AISeverity,
  type DisasterClassification,
} from "@/services/aiClassifier";

export type Category = "Rescue" | "Medical" | "Supplies" | "Infrastructure";

export const LIVE_FEED_INTERVAL_MS = 9000; // 9 seconds (1 new post every 8 to 10s)

export interface SimPost {
  id: string;
  handle: string;
  source: "X" | "Emergency Line" | "Field Radio" | "Citizen App" | "Sensor Grid";
  body: string;
  category: Category;
  aiCategory?: AICategory;
  confidence: number;
  priority: Priority;
  severity?: AISeverity;
  fake: boolean;
  receivedAt: number;
  lat: number;
  lng: number;
  locationDetected?: string;
  recommendedAction?: string;
  aiClassification?: DisasterClassification;
  isAiClassified?: boolean;
}

export interface RawPost {
  handle: string;
  source: SimPost["source"];
  body: string;
}

export const rawPosts: RawPost[] = [
  { handle: "@amdavadi_raj", source: "X", body: "Trapped on 2nd floor near Sabarmati Riverfront, water rising fast! Need rescue boat ASAP!" },
  { handle: "shelter_ops", source: "Citizen App", body: "Need food packets and clean drinking water at Satellite shelter, around 200 people evacuated from Bopal." },
  { handle: "Unit 09", source: "Field Radio", body: "Road completely blocked by fallen tree on SG Highway near ISCON mega-mall, convoy rerouting via Ring Road." },
  { handle: "Call 5522", source: "Emergency Line", body: "Elderly man unconscious near Maninagar railway station, breathing shallow, needs urgent ambulance." },
  { handle: "@relief_rita", source: "X", body: "Family of five stuck on rooftop behind the old mill in Paldi, send rescue boat immediately." },
  { handle: "clinic_north", source: "Citizen App", body: "Out of insulin and saline at Navrangpura clinic, urgent medical resupply required before night." },
  { handle: "Node SBR-14", source: "Sensor Grid", body: "Sabarmati bridge strain sensors exceeding safe limits, river water level high, closure recommended." },
  { handle: "@viral_alerts", source: "X", body: "BREAKING: Narmada dam has collapsed, millions dead, government hiding it, share fast before deleted!!" },
  { handle: "Unit 21", source: "Field Radio", body: "Two children separated from parents at Maninagar evacuation point, immediate rescue pickup needed." },
  { handle: "@ward_help", source: "X", body: "Drinking water tankers have not arrived in Vasna ward for two days, residents desperate." },
  { handle: "Call 5530", source: "Emergency Line", body: "Woman in active labour, cannot reach hospital, roads flooded near Paldi crossing, doctor needed." },
  { handle: "@fastnews_now", source: "X", body: "FORWARDED: army says leave Ahmedabad tonight or you will be arrested, share fast to all groups" },
  { handle: "Node PWR-03", source: "Sensor Grid", body: "Substation offline near Bopal, 6 residential blocks without power, generator dispatch advised." },
  { handle: "volunteer_sam", source: "Citizen App", body: "Blankets and dry rations needed at SG Highway community hall before nightfall for flood victims." },
  { handle: "Unit 33", source: "Field Radio", body: "Partial wall collapse on Satellite approach road, one person pinned under debris, hydraulic rescue required." },
  { handle: "@motera_watch", source: "X", body: "Heavy waterlogging near Chandkheda, water entering ground floor houses, 12 families need evacuation." },
  { handle: "Call 5548", source: "Emergency Line", body: "Short circuit and sparking transformer outside Navrangpura bus stop near school, danger of fire." },
  { handle: "relief_east", source: "Citizen App", body: "Medical emergency in Naroda industrial zone, chemical storage inundated, 3 workers experiencing breathing difficulty." },
];

export const AHMEDABAD_DISTRICT_COORDS: Record<string, [number, number]> = {
  "Sabarmati Riverfront": [23.0410, 72.5690],
  "SG Highway": [23.0290, 72.5070],
  "Maninagar": [22.9990, 72.6120],
  "Navrangpura": [23.0360, 72.5390],
  "Paldi": [23.0150, 72.5670],
  "Satellite": [23.0260, 72.5100],
  "Bopal": [23.0180, 72.4630],
  "Vasna": [23.0080, 72.5530],
  "Chandkheda": [23.0990, 72.5850],
  "Naroda": [23.0670, 72.6480],
  "Vastrapur": [23.0350, 72.5290],
  "Ahmedabad Central": [23.0225, 72.5714],
};

const defaultCoordsList: [number, number][] = Object.values(AHMEDABAD_DISTRICT_COORDS);

let counter = 0;

function getCoordinatesForLocation(locName?: string, index = 0): [number, number] {
  let base = locName && AHMEDABAD_DISTRICT_COORDS[locName]
    ? AHMEDABAD_DISTRICT_COORDS[locName]
    : defaultCoordsList[index % defaultCoordsList.length]!;

  return [
    base[0] + (Math.random() - 0.5) * 0.009,
    base[1] + (Math.random() - 0.5) * 0.009,
  ];
}

/**
 * Creates a SimPost using the synchronous heuristic classifier (instant render)
 */
export function makePost(index: number): SimPost {
  const raw = rawPosts[index % rawPosts.length]!;
  counter += 1;
  const classification = mockClassifyDisasterPost(raw.body);
  const [lat, lng] = getCoordinatesForLocation(classification.location_detected, index);

  const confPercent = Math.round(classification.confidence > 1 ? classification.confidence : classification.confidence * 100);

  return {
    id: `SIG-${9100 + counter}`,
    handle: raw.handle,
    source: raw.source,
    body: raw.body,
    receivedAt: Date.now(),
    category: mapAICategoryToLegacy(classification.category),
    aiCategory: classification.category,
    confidence: confPercent,
    priority: mapAISeverityToPriority(classification.severity),
    severity: classification.severity,
    fake: classification.fake_news_flag,
    locationDetected: classification.location_detected,
    recommendedAction: classification.recommended_action,
    lat,
    lng,
    aiClassification: classification,
    isAiClassified: true,
  };
}

/**
 * Creates a SimPost by calling the AI classification service (Gemini API)
 */
export async function makePostAsync(index: number): Promise<SimPost> {
  const raw = rawPosts[index % rawPosts.length]!;
  counter += 1;
  const id = `SIG-${9100 + counter}`;

  try {
    const classification = await classifyDisasterPost(raw.body);
    const [lat, lng] = getCoordinatesForLocation(classification.location_detected, index);
    const confPercent = Math.round(classification.confidence > 1 ? classification.confidence : classification.confidence * 100);

    return {
      id,
      handle: raw.handle,
      source: raw.source,
      body: raw.body,
      receivedAt: Date.now(),
      category: mapAICategoryToLegacy(classification.category),
      aiCategory: classification.category,
      confidence: confPercent,
      priority: mapAISeverityToPriority(classification.severity),
      severity: classification.severity,
      fake: classification.fake_news_flag,
      locationDetected: classification.location_detected,
      recommendedAction: classification.recommended_action,
      lat,
      lng,
      aiClassification: classification,
      isAiClassified: true,
    };
  } catch {
    return makePost(index);
  }
}

export function seedPosts(count = 5): SimPost[] {
  return Array.from({ length: count }, (_, i) => makePost(i)).reverse();
}

export async function seedPostsAsync(count = 5): Promise<SimPost[]> {
  const promises = Array.from({ length: count }, (_, i) => makePostAsync(i));
  const posts = await Promise.all(promises);
  return posts.reverse();
}
