import { Suspense, lazy, useEffect, useState } from "react";
import { priorityColor, priorityLabel, type Priority } from "@/lib/incidents";
import { statusColor, statusLabel } from "@/lib/ops";
import type { MapProps } from "./EmergencyMapInner";

const MapClient = lazy(() => import("./EmergencyMapInner"));

const legend: Priority[] = ["critical", "high", "moderate", "low"];

export function EmergencyMap(props: MapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-xl border border-border bg-muted/40 lg:h-[520px]">
      {mounted ? (
        <Suspense fallback={<MapSkeleton />}>
          <MapClient {...props} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg border border-border bg-card/90 px-3 py-2 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Priority
        </p>
        <div className="flex flex-col gap-1">
          {legend.map((p) => (
            <div key={p} className="flex items-center gap-2 text-[11px] text-foreground">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: priorityColor[p] }}
              />
              {priorityLabel[p]}
            </div>
          ))}
          {(["rescue", "medical", "resolved", "spam"] as const).map((s) => (
            <div key={s} className="flex items-center gap-2 text-[11px] text-foreground">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: statusColor[s] }} />
              {statusLabel[s]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
      Loading tactical map…
    </div>
  );
}
