import { createFileRoute } from "@tanstack/react-router";
import {
  TriangleAlert as AlertTriangle,
  LifeBuoy,
  CircleCheck as CheckCircle2,
  Users,
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
      { title: "ResQ Overview — Ahmedabad Central" },
      {
        name: "description",
        content:
          "Live disaster intelligence overview: active alerts, priority rescues, city incident map and incoming emergency signals for Ahmedabad.",
      },
      { property: "og:title", content: "ResQ Overview — Ahmedabad Central" },
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
    <div className="space-y-3 overflow-x-hidden">
      {/* ── Active incident banner ─────────────────────────────────────────── */}
      {activeScenario && scenarioInfo && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-destructive/20 bg-destructive/5 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-destructive">
              Active Incident
            </span>
            <span className="text-[12px] text-foreground font-medium">
              {scenarioInfo.name}
            </span>
            <span className="hidden sm:inline text-[11px] text-muted-foreground">
              — {scenarioInfo.description}
            </span>
          </div>
          <span className="rounded border border-destructive/20 bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive uppercase">
            {scenarioInfo.badge}
          </span>
        </div>
      )}

      {/* ── Compact operational statistics ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <StatCard
          label="Active Incidents"
          tag=""
          value={String(stats.activeAlerts)}
          delta={activeScenario === "flood" ? "+16 surge in Sector 1" : "+6 in last hour"}
          trend="up"
          icon={AlertTriangle}
          tone="destructive"
        />
        <StatCard
          label="Priority Rescues"
          tag=""
          value={String(stats.highPriorityRescues)}
          delta={activeScenario === "flood" ? "NDRF 12 & 33 deployed" : "4 teams en route"}
          trend="up"
          icon={LifeBuoy}
          tone="warning"
        />
        <StatCard
          label="People Affected"
          tag=""
          value={String(parseInt(stats.resolvedToday || "0", 10) * 42)}
          delta="Across 8 sectors"
          trend="flat"
          icon={Users}
          tone="primary"
        />
        <StatCard
          label="Resolved Today"
          tag=""
          value={String(stats.resolvedToday)}
          delta="-9% response time"
          trend="down"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {/* ── Map-centric content area ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_320px]">
        {/* Map column — dominant visual */}
        <section className="space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Tactical Map
              </p>
              <h2 className="text-[13px] font-semibold text-foreground mt-0.5">
                City Incident Map — Ahmedabad
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {incidents.length + (activeScenario ? scenarioInfo?.posts.length || 0 : 0)} geolocated signals
              </p>
            </div>
            <span className="rounded border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
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

          {/* ── Priority queue ────────────────────────────────────────────── */}
          <div className="rounded border border-border bg-card">
            <div className="border-b border-border px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Priority Queue
              </p>
            </div>
            <ul className="divide-y divide-border">
              {incidents.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-3 py-2 text-[12px]">
                  <span className="font-mono text-[10px] text-muted-foreground">{i.id}</span>
                  <span className="min-w-0 flex-1 truncate text-foreground">{i.title}</span>
                  <span className="hidden text-[11px] text-muted-foreground sm:block">{i.district}</span>
                  <PriorityBadge priority={i.priority} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Live feed column — compact sidebar */}
        <LiveFeed className="max-h-[600px]" feed={feed} onSelect={setSelectedId} />
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
