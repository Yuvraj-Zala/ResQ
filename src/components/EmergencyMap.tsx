import { Suspense, lazy, useEffect, useState } from "react";
import { Waves } from "lucide-react";
import { priorityColor, priorityLabel, type Priority } from "@/lib/incidents";
import { statusColor, statusLabel } from "@/lib/ops";
import type { MapProps } from "./EmergencyMapInner";

const MapClient = lazy(() => import("./EmergencyMapInner"));

const legend: Priority[] = ["critical", "high", "moderate", "low"];

export function EmergencyMap(props: MapProps) {
  const [mounted, setMounted] = useState(false);
  const [showFloodZones, setShowFloodZones] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-sm border border-border bg-muted/40 lg:h-[520px]">
      {/* Corner accent - top left */}
      <div className="pointer-events-none absolute left-0 top-0 z-[500] size-4 border-l-2 border-t-2 border-primary/50" />
      {/* Corner accent - bottom right */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-[500] size-4 border-b-2 border-r-2 border-primary/50" />

      {mounted ? (
        <Suspense fallback={<MapSkeleton />}>
          <MapClient {...props} showFloodZones={showFloodZones} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}

      {/* Tactical legend - bottom left */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-sm border border-border bg-card/95 px-3 py-2 backdrop-blur">
        <p className="mb-1.5 font-mono text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
          [LEGEND_PRIORITY]
        </p>
        <div className="flex flex-col gap-0.5">
          {legend.map((p) => (
            <div key={p} className="flex items-center gap-2 font-mono text-[10px] text-foreground">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: priorityColor[p] }}
              />
              {priorityLabel[p]}
            </div>
          ))}
        </div>
        <div className="my-1.5 h-px bg-border" />
        <p className="mb-1 font-mono text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
          [LEGEND_STATUS]
        </p>
        <div className="flex flex-col gap-0.5">
          {(["rescue", "medical", "resolved", "spam"] as const).map((s) => (
            <div key={s} className="flex items-center gap-2 font-mono text-[10px] text-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: statusColor[s] }} />
              {statusLabel[s]}
            </div>
          ))}
        </div>
      </div>

      {/* Flood zone toggle - top right */}
      <button
        onClick={() => setShowFloodZones((v) => !v)}
        className={`absolute right-3 top-3 z-[500] flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-colors ${
          showFloodZones
            ? "border-blue-500/40 bg-blue-500/15 text-blue-400"
            : "border-border bg-card/90 text-muted-foreground hover:text-foreground"
        }`}
      >
        <Waves className="size-3" />
        Flood Risk Zones
        {showFloodZones && <span className="size-1.5 animate-pulse rounded-full bg-blue-400" />}
      </button>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center font-mono text-xs text-muted-foreground">
      [INIT_MAP] Loading tactical map...
    </div>
  );
}
