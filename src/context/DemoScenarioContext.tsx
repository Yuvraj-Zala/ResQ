import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { SimPost } from "@/lib/simulator";

export type ScenarioType = "flood" | "misinfo" | "evacuation";

export interface ScenarioInfo {
  id: ScenarioType;
  name: string;
  shortName: string;
  tag: string;
  badge: string;
  description: string;
  focus: [number, number];
  sector: string;
  activationLevel: string;
  stats: {
    activeAlerts: string;
    highPriorityRescues: string;
    resolvedToday: string;
    connectedSources: string;
  };
  posts: SimPost[];
}

export const DEMO_SCENARIOS: Record<ScenarioType, ScenarioInfo> = {
  flood: {
    id: "flood",
    name: "Flood Surge (Sabarmati)",
    shortName: "Flood Surge",
    tag: "SECTOR 1",
    badge: "CRITICAL FLOOD",
    description: "Sudden flood surge on Sabarmati Riverfront with stranded citizens and submerged walkways.",
    focus: [23.0410, 72.5690],
    sector: "SECTOR 1 · SABARMATI RIVERFRONT",
    activationLevel: "LEVEL 3 ACTIVATION (RED)",
    stats: {
      activeAlerts: "48",
      highPriorityRescues: "22",
      resolvedToday: "147",
      connectedSources: "26",
    },
    posts: [
      {
        id: "SIG-FL-01",
        handle: "@sabarmati_watch",
        source: "X",
        body: "CRITICAL: Riverfront walkway submerged! 14 citizens trapped on promenade lower deck near Subhash Bridge, water rising fast!",
        category: "Rescue",
        aiCategory: "Rescue Required",
        priority: "critical",
        severity: "CRITICAL",
        confidence: 98,
        fake: false,
        locationDetected: "Sabarmati Riverfront",
        recommendedAction: "Dispatch NDRF swift-water rescue team with inflatable boats immediately.",
        lat: 23.0425,
        lng: 72.5705,
        receivedAt: Date.now(),
        isAiClassified: true,
      },
      {
        id: "SIG-FL-02",
        handle: "Call 112-901",
        source: "Emergency Line",
        body: "Water breached into Nehru Bridge underpass, 6 vehicles trapped with floodwaters rising up to windshields!",
        category: "Rescue",
        aiCategory: "Rescue Required",
        priority: "critical",
        severity: "CRITICAL",
        confidence: 99,
        fake: false,
        locationDetected: "Sabarmati Riverfront",
        recommendedAction: "Deploy heavy winch recovery trucks and emergency evacuation squad.",
        lat: 23.0380,
        lng: 72.5720,
        receivedAt: Date.now() - 12000,
        isAiClassified: true,
      },
      {
        id: "SIG-FL-03",
        handle: "Node SBR-04",
        source: "Sensor Grid",
        body: "River level sensor exceeding 138.5 ft at Subhash Bridge station, 180,000 cusecs upstream discharge confirmed.",
        category: "Infrastructure",
        aiCategory: "Infrastructure Damage",
        priority: "high",
        severity: "HIGH",
        confidence: 96,
        fake: false,
        locationDetected: "Sabarmati Riverfront",
        recommendedAction: "Sound flood sirens and close all riverside walkways immediately.",
        lat: 23.0450,
        lng: 72.5680,
        receivedAt: Date.now() - 25000,
        isAiClassified: true,
      },
    ],
  },
  misinfo: {
    id: "misinfo",
    name: "Misinformation Attack",
    shortName: "Misinfo Attack",
    tag: "NLP VERIFIED",
    badge: "FAKE NEWS FLAGGED",
    description: "Suspicious social media rumors with low confidence scores and red misinformation flags.",
    focus: [23.0225, 72.5714],
    sector: "SECTOR AHMEDABAD CENTRAL",
    activationLevel: "INFO SEC VERIFICATION",
    stats: {
      activeAlerts: "38",
      highPriorityRescues: "12",
      resolvedToday: "147",
      connectedSources: "26",
    },
    posts: [
      {
        id: "SIG-FAKE-01",
        handle: "@viral_news99",
        source: "X",
        body: "BREAKING: Narmada dam has completely collapsed, water will drown all of Ahmedabad in 30 mins, government hiding it, share fast to all groups!!",
        category: "Supplies",
        aiCategory: "Irrelevant",
        priority: "low",
        severity: "LOW",
        confidence: 97,
        fake: true,
        locationDetected: "Ahmedabad Central",
        recommendedAction: "Flag for manual verification and withhold field dispatch to prevent panic.",
        lat: 23.0240,
        lng: 72.5730,
        receivedAt: Date.now(),
        isAiClassified: true,
      },
      {
        id: "SIG-FAKE-02",
        handle: "@forwarded_alert",
        source: "X",
        body: "FORWARDED: Army has declared emergency curfew across Ahmedabad, anyone stepping outside will be arrested tonight, share to 10 WhatsApp groups immediately!!",
        category: "Supplies",
        aiCategory: "Irrelevant",
        priority: "low",
        severity: "LOW",
        confidence: 96,
        fake: true,
        locationDetected: "Ahmedabad Central",
        recommendedAction: "Flag as unverified misinformation. Issue official police denial.",
        lat: 23.0210,
        lng: 72.5690,
        receivedAt: Date.now() - 10000,
        isAiClassified: true,
      },
      {
        id: "SIG-FAKE-03",
        handle: "user_rumor8",
        source: "Citizen App",
        body: "Toxic chemical cloud released near Navrangpura and SG Highway, millions dead according to leaked report, share fast before internet cut!!",
        category: "Supplies",
        aiCategory: "Irrelevant",
        priority: "low",
        severity: "LOW",
        confidence: 95,
        fake: true,
        locationDetected: "Navrangpura",
        recommendedAction: "Withhold dispatch. AMC pollution control confirms air quality normal.",
        lat: 23.0360,
        lng: 72.5390,
        receivedAt: Date.now() - 20000,
        isAiClassified: true,
      },
    ],
  },
  evacuation: {
    id: "evacuation",
    name: "Mass Evacuation (Vasna)",
    shortName: "Mass Evacuation",
    tag: "SECTOR 4",
    badge: "DISCHARGE ALERT",
    description: "Sluice gate opening at Vasna Barrage requiring emergency evacuation and bus convoys.",
    focus: [23.0080, 72.5530],
    sector: "SECTOR 4 · VASNA BARRAGE",
    activationLevel: "MASS EVACUATION ACTIVE",
    stats: {
      activeAlerts: "44",
      highPriorityRescues: "28",
      resolvedToday: "159",
      connectedSources: "28",
    },
    posts: [
      {
        id: "SIG-EVAC-01",
        handle: "Vasna DEOC",
        source: "Field Radio",
        body: "Vasna Barrage gates 12-18 opened at maximum discharge! 450+ residents in low-lying Fatehpura settlement require immediate bus evacuation!",
        category: "Rescue",
        aiCategory: "Rescue Required",
        priority: "critical",
        severity: "CRITICAL",
        confidence: 99,
        fake: false,
        locationDetected: "Vasna",
        recommendedAction: "Deploy 12 AMC transit evacuation buses and police escort to Vasna Barrage.",
        lat: 23.0075,
        lng: 72.5510,
        receivedAt: Date.now(),
        isAiClassified: true,
      },
      {
        id: "SIG-EVAC-02",
        handle: "Unit 12",
        source: "Field Radio",
        body: "Convoy Unit 12 on scene at Vasna relief point. 85 elderly and children awaiting transport to Satellite shelter.",
        category: "Supplies",
        aiCategory: "Food & Shelter",
        priority: "high",
        severity: "HIGH",
        confidence: 97,
        fake: false,
        locationDetected: "Vasna",
        recommendedAction: "Coordinate shelter bedding and emergency ration distribution at Satellite camp.",
        lat: 23.0090,
        lng: 72.5550,
        receivedAt: Date.now() - 12000,
        isAiClassified: true,
      },
      {
        id: "SIG-EVAC-03",
        handle: "Call 5580",
        source: "Emergency Line",
        body: "Vasna community clinic inundated, 14 patients on oxygen support need urgent transfer to SVP Hospital.",
        category: "Medical",
        aiCategory: "Medical Help",
        priority: "critical",
        severity: "CRITICAL",
        confidence: 98,
        fake: false,
        locationDetected: "Vasna",
        recommendedAction: "Deploy 6 ALS Ambulances and medical transport convoy immediately.",
        lat: 23.0060,
        lng: 72.5540,
        receivedAt: Date.now() - 25000,
        isAiClassified: true,
      },
    ],
  },
};

function playTone(freq = 880, duration = 0.35) {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration - 0.02);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => void ctx.close();
  } catch {
    /* silent */
  }
}

interface DemoScenarioContextType {
  activeScenario: ScenarioType | null;
  scenarioInfo: ScenarioInfo | null;
  mapFocus: [number, number] | null;
  injectedPosts: SimPost[];
  stats: {
    activeAlerts: string;
    highPriorityRescues: string;
    resolvedToday: string;
    connectedSources: string;
  };
  sector: string;
  activationLevel: string;
  triggerScenario: (scenario: ScenarioType) => void;
  resetScenario: () => void;
}

const DEFAULT_STATS = {
  activeAlerts: "38",
  highPriorityRescues: "12",
  resolvedToday: "147",
  connectedSources: "26",
};

const DemoScenarioContext = createContext<DemoScenarioContextType | undefined>(undefined);

export function DemoScenarioProvider({ children }: { children: ReactNode }) {
  const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);
  const [mapFocus, setMapFocus] = useState<[number, number] | null>(null);
  const [injectedPosts, setInjectedPosts] = useState<SimPost[]>([]);

  const scenarioInfo = activeScenario ? DEMO_SCENARIOS[activeScenario] : null;

  const triggerScenario = useCallback((type: ScenarioType) => {
    const info = DEMO_SCENARIOS[type];
    if (!info) return;

    setActiveScenario(type);
    setMapFocus([...info.focus]);
    setInjectedPosts([...info.posts]);

    // Audio Ping
    if (type === "flood") {
      playTone(880, 0.4);
      setTimeout(() => playTone(980, 0.3), 150);
    } else if (type === "misinfo") {
      playTone(550, 0.3);
    } else if (type === "evacuation") {
      playTone(750, 0.35);
      setTimeout(() => playTone(880, 0.3), 180);
    }
  }, []);

  const resetScenario = useCallback(() => {
    setActiveScenario(null);
    setMapFocus(null);
    setInjectedPosts([]);
  }, []);

  const stats = scenarioInfo ? scenarioInfo.stats : DEFAULT_STATS;
  const sector = scenarioInfo ? scenarioInfo.sector : "SECTOR: AHMEDABAD CENTRAL";
  const activationLevel = scenarioInfo ? scenarioInfo.activationLevel : "LEVEL 3 ACTIVATION";

  return (
    <DemoScenarioContext.Provider
      value={{
        activeScenario,
        scenarioInfo,
        mapFocus,
        injectedPosts,
        stats,
        sector,
        activationLevel,
        triggerScenario,
        resetScenario,
      }}
    >
      {children}
    </DemoScenarioContext.Provider>
  );
}

export function useDemoScenario() {
  const ctx = useContext(DemoScenarioContext);
  if (!ctx) {
    throw new Error("useDemoScenario must be used within a DemoScenarioProvider");
  }
  return ctx;
}
