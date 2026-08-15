import { createFileRoute } from "@tanstack/react-router";
import {
  TriangleAlert as AlertTriangle,
  LifeBuoy,
  CircleCheck as CheckCircle2,
  Antenna,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmergencyMap } from "@/components/EmergencyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { PriorityBadge } from "@/components/PriorityBadge";
import { incidents } from "@/lib/incidents";
import { IncidentActionModal } from "@/components/IncidentActionModal";
import { useIngestionFeed } from "@/hooks/useIngestionFeed";
import { useDemoScenario } from "@/context/DemoScenarioContext";
import type { IncidentStatus } from "@/lib/ops";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RescuAI Overview — Ahmedabad Central Command" },
      {
        name: "description",
        content:
          "Live disaster intelligence overview: active alerts, priority rescues, city incident map and incoming emergency signals for Ahmedabad.",
      },
      { property: "og:title", content: "RescuAI Overview — Ahmedabad Central Command" },
      {
        property: "og:description",
        content: "Monitor alerts, rescues and emergency signals across Ahmedabad in real time.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const feed = useIngestionFeed();
  const { posts, selectedId, setSelectedId, statusOf, setStatus } = feed;
  const { stats, mapFocus, activeScenario, scenarioInfo, sector } = useDemoScenario();
  const selected = posts.find((p) => p.id === selectedId) ?? null;

  const handleAction = (status: IncidentStatus) => {
    if (!selectedId) return;
    setStatus(selectedId, status);
    setSelectedId(null);
  };

  return (
    <div className="space-y-4">
      {/* Active Scenario Banner — Action Blue inline callout */}
      {activeScenario && scenarioInfo && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[11px] border border-[#0066cc]/30 bg-[#0066cc]/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#2997ff] animate-ping" />
            <span
              className="font-mono font-semibold uppercase text-[#2997ff]"
              style={{ fontSize: 11 }}
            >
              [ACTIVE SCENARIO: {scenarioInfo.name}]
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-white/60">
              — {scenarioInfo.description}
            </span>
          </div>
          <span className="rounded-[8px] border border-[#0066cc]/30 bg-[#0066cc]/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#2997ff]">
            {scenarioInfo.badge}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Active Alerts"
          tag="[SYS.STAT_01]"
          value={stats.activeAlerts}
          delta={activeScenario === "flood" ? "+16 surge in Sector 1" : "+6 in last hour"}
          trend="up"
          icon={AlertTriangle}
          tone="destructive"
        />
        <StatCard
          label="High Priority Rescues"
          tag="[SYS.STAT_02]"
          value={stats.highPriorityRescues}
          delta={activeScenario === "flood" ? "NDRF Unit 12 & 33 deployed" : "4 teams en route"}
          trend="up"
          icon={LifeBuoy}
          tone="warning"
        />
        <StatCard
          label="Resolved Today"
          tag="[SYS.STAT_03]"
          value={stats.resolvedToday}
          delta="-9% response time"
          trend="down"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Connected Sources"
          tag="[SYS.STAT_04]"
          value={stats.connectedSources}
          delta="All channels nominal"
          trend="flat"
          icon={Antenna}
          tone="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-mono uppercase text-white/40"
                style={{ fontSize: 9, letterSpacing: "0.06em", lineHeight: 1 }}
              >
                [MAP_TACTICAL_VIEW]
              </p>
              <h2
                className="mt-1 text-white"
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.374px",
                  lineHeight: 1.29,
                }}
              >
                City Incident Map — Ahmedabad
              </h2>
              <p className="mt-0.5 font-mono text-[10px] text-white/40">
                {incidents.length + (activeScenario ? scenarioInfo?.posts.length || 0 : 0)}{" "}
                geolocated signals · auto-refresh 30s
              </p>
            </div>
            <span className="rounded-[8px] border border-white/12 bg-white/6 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-widest text-[#2997ff]">
              {sector}
            </span>
          </div>

          <EmergencyMap
            posts={posts}
            statusOf={statusOf}
            selectedId={selectedId}
            onSelect={(p) => setSelectedId(p.id)}
            mapFocus={mapFocus}
          />

          <div className="rounded-[18px] border border-white/10 bg-[#272729]">
            <div className="border-b border-white/8 px-4 py-3">
              <p
                className="font-mono uppercase text-white/40"
                style={{ fontSize: 9, letterSpacing: "0.06em", lineHeight: 1 }}
              >
                [QUEUE_PRIORITY]
              </p>
              <h2
                className="mt-1 text-white"
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.374px",
                  lineHeight: 1.29,
                }}
              >
                Priority Queue
              </h2>
            </div>
            <ul className="divide-y divide-white/6">
              {incidents.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-4 py-3 text-[13px]">
                  <span className="font-mono text-[10px] text-white/40">{i.id}</span>
                  <span className="min-w-0 flex-1 truncate text-white/85">{i.title}</span>
                  <span className="hidden text-[11px] text-white/40 sm:block">{i.district}</span>
                  <PriorityBadge priority={i.priority} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <LiveFeed className="max-h-[720px]" feed={feed} onSelect={setSelectedId} />
      </div>

      <IncidentActionModal
        post={selected}
        status={selected ? statusOf(selected) : "new"}
        onAction={handleAction}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}
