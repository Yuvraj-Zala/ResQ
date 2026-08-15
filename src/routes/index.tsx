import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, LifeBuoy, CheckCircle2, Antenna } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmergencyMap } from "@/components/EmergencyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { PriorityBadge } from "@/components/PriorityBadge";
import { incidents } from "@/lib/incidents";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RescuAI Overview — Disaster Intelligence Command" },
      {
        name: "description",
        content:
          "Live disaster intelligence overview: active alerts, priority rescues, city incident map and incoming emergency signals.",
      },
      { property: "og:title", content: "RescuAI Overview — Disaster Intelligence Command" },
      {
        property: "og:description",
        content: "Monitor alerts, rescues and emergency signals across the city in real time.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Alerts" value="38" delta="+6 in last hour" trend="up" icon={AlertTriangle} tone="destructive" />
        <StatCard label="High Priority Rescues" value="12" delta="4 teams en route" trend="up" icon={LifeBuoy} tone="warning" />
        <StatCard label="Resolved Today" value="147" delta="-9% response time" trend="down" icon={CheckCircle2} tone="success" />
        <StatCard label="Connected Sources" value="26" delta="All channels nominal" trend="flat" icon={Antenna} tone="primary" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">City Incident Map</h2>
              <p className="text-xs text-muted-foreground">
                {incidents.length} geolocated incidents · auto-refresh 30s
              </p>
            </div>
            <span className="rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Sector Mumbai-West
            </span>
          </div>

          <EmergencyMap />

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Priority Queue</h2>
            </div>
            <ul className="divide-y divide-border">
              {incidents.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="font-mono text-[11px] text-muted-foreground">{i.id}</span>
                  <span className="min-w-0 flex-1 truncate text-foreground">{i.title}</span>
                  <span className="hidden text-xs text-muted-foreground sm:block">{i.district}</span>
                  <PriorityBadge priority={i.priority} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <LiveFeed className="max-h-[720px]" />
      </div>
    </div>
  );
}
