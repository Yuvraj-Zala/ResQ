import { createFileRoute } from "@tanstack/react-router";
import { TriangleAlert as AlertTriangle, LifeBuoy, CircleCheck as CheckCircle2, Antenna } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmergencyMap } from "@/components/EmergencyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { PriorityBadge } from "@/components/PriorityBadge";
import { incidents } from "@/lib/incidents";
import { IncidentActionModal } from "@/components/IncidentActionModal";
import { useIngestionFeed } from "@/hooks/useIngestionFeed";
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
  const selected = posts.find((p) => p.id === selectedId) ?? null;

  const handleAction = (status: IncidentStatus) => {
    if (!selectedId) return;
    setStatus(selectedId, status);
    setSelectedId(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Active Alerts" tag="[SYS.STAT_01]" value="38" delta="+6 in last hour" trend="up" icon={AlertTriangle} tone="destructive" />
        <StatCard label="High Priority Rescues" tag="[SYS.STAT_02]" value="12" delta="4 teams en route" trend="up" icon={LifeBuoy} tone="warning" />
        <StatCard label="Resolved Today" tag="[SYS.STAT_03]" value="147" delta="-9% response time" trend="down" icon={CheckCircle2} tone="success" />
        <StatCard label="Connected Sources" tag="[SYS.STAT_04]" value="26" delta="All channels nominal" trend="flat" icon={Antenna} tone="primary" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/70">
                [MAP_TACTICAL_VIEW]
              </p>
              <h2 className="text-[13px] font-semibold text-foreground">City Incident Map — Ahmedabad</h2>
              <p className="font-mono text-[10px] text-muted-foreground">
                {incidents.length} geolocated incidents · auto-refresh 30s
              </p>
            </div>
            <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Sector Ahmedabad Central
            </span>
          </div>

          <EmergencyMap
            posts={posts}
            statusOf={statusOf}
            selectedId={selectedId}
            onSelect={(p) => setSelectedId(p.id)}
          />

          <div className="relative rounded-sm border border-border bg-card">
            <div className="pointer-events-none absolute left-0 top-0 size-3 border-l-2 border-t-2 border-primary/40" />
            <div className="border-b border-border px-3 py-2.5">
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/70">
                [QUEUE_PRIORITY]
              </p>
              <h2 className="text-[13px] font-semibold text-foreground">Priority Queue</h2>
            </div>
            <ul className="divide-y divide-border">
              {incidents.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-3 py-2.5 text-[13px]">
                  <span className="font-mono text-[10px] text-muted-foreground">{i.id}</span>
                  <span className="min-w-0 flex-1 truncate text-foreground">{i.title}</span>
                  <span className="hidden text-[11px] text-muted-foreground sm:block">{i.district}</span>
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
