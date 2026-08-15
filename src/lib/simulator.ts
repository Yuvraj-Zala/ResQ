import type { Priority } from "./incidents";

export type Category = "Rescue" | "Medical" | "Supplies" | "Infrastructure";

export interface SimPost {
  id: string;
  handle: string;
  source: "X" | "Emergency Line" | "Field Radio" | "Citizen App" | "Sensor Grid";
  body: string;
  category: Category;
  confidence: number;
  priority: Priority;
  fake: boolean;
  receivedAt: number;
}

interface RawPost {
  handle: string;
  source: SimPost["source"];
  body: string;
}

export const rawPosts: RawPost[] = [
  { handle: "@arjun_m", source: "X", body: "Trapped on 2nd floor near Main St, water rising!" },
  { handle: "shelter_ops", source: "Citizen App", body: "Need food packets at St. Jude shelter, around 200 people." },
  { handle: "Unit 09", source: "Field Radio", body: "Road blocked by fallen tree on Highway 4, convoy rerouting." },
  { handle: "Call 5522", source: "Emergency Line", body: "Elderly man unconscious, breathing shallow, needs ambulance at Sector 7." },
  { handle: "@relief_rita", source: "X", body: "Family of five stuck on rooftop behind the old textile mill, send boat." },
  { handle: "clinic_north", source: "Citizen App", body: "Out of insulin and saline at north clinic, urgent resupply required." },
  { handle: "Node BRD-14", source: "Sensor Grid", body: "Bridge strain sensors exceeding safe limits, closure recommended." },
  { handle: "@viral_alerts", source: "X", body: "BREAKING: entire city dam has collapsed, millions dead, government hiding it!!" },
  { handle: "Unit 21", source: "Field Radio", body: "Two children separated from parents at evacuation point B, need pickup." },
  { handle: "@ward_help", source: "X", body: "Drinking water tankers have not arrived in Ward 9 for two days." },
  { handle: "Call 5530", source: "Emergency Line", body: "Woman in labour, cannot reach hospital, roads flooded near Lake Road." },
  { handle: "@fastnews_now", source: "X", body: "FORWARDED: army says leave the city tonight or you will be arrested, share fast" },
  { handle: "Node PWR-03", source: "Sensor Grid", body: "Substation offline, 6 blocks without power, generator dispatch advised." },
  { handle: "volunteer_sam", source: "Citizen App", body: "Blankets and dry rations needed at community hall shelter before nightfall." },
  { handle: "Unit 33", source: "Field Radio", body: "Partial wall collapse on Ferry Lane, one person pinned under debris." },
];

const rules: { category: Category; priority: Priority; words: string[] }[] = [
  {
    category: "Rescue",
    priority: "critical",
    words: ["trapped", "rooftop", "stuck", "pinned", "rescue", "boat", "separated", "missing", "drowning"],
  },
  {
    category: "Medical",
    priority: "high",
    words: ["unconscious", "ambulance", "insulin", "saline", "labour", "injured", "breathing", "clinic", "oxygen"],
  },
  {
    category: "Supplies",
    priority: "moderate",
    words: ["food", "water", "blanket", "ration", "tanker", "shelter", "supply", "resupply", "packets"],
  },
  {
    category: "Infrastructure",
    priority: "moderate",
    words: ["road", "bridge", "tree", "power", "substation", "collapse", "blocked", "highway", "wall"],
  },
];

const fakeSignals = ["breaking:", "forwarded:", "share fast", "hiding it", "millions dead", "!!"];

/** Lightweight keyword-scoring stand-in for an NLP classifier. */
export function classify(body: string): {
  category: Category;
  confidence: number;
  priority: Priority;
  fake: boolean;
} {
  const text = body.toLowerCase();

  let best = rules[0]!;
  let bestScore = 0;
  for (const rule of rules) {
    const score = rule.words.reduce((acc, w) => (text.includes(w) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }

  const fakeScore = fakeSignals.reduce((acc, s) => (text.includes(s) ? acc + 1 : acc), 0);
  const fake = fakeScore >= 2;

  // Confidence: base on keyword density, clamped to 85-99, penalised for fake signals.
  const raw = 85 + Math.min(bestScore, 3) * 4 + (bestScore > 0 ? 2 : 0) - fakeScore * 3;
  const confidence = Math.max(85, Math.min(99, Math.round(raw)));

  const priority: Priority = fake ? "low" : bestScore === 0 ? "low" : best.priority;

  return { category: best.category, confidence, priority, fake };
}

let counter = 0;

export function makePost(index: number): SimPost {
  const raw = rawPosts[index % rawPosts.length]!;
  counter += 1;
  return {
    id: `SIG-${9100 + counter}`,
    handle: raw.handle,
    source: raw.source,
    body: raw.body,
    receivedAt: Date.now(),
    ...classify(raw.body),
  };
}

export function seedPosts(count = 5): SimPost[] {
  return Array.from({ length: count }, (_, i) => makePost(i)).reverse();
}
