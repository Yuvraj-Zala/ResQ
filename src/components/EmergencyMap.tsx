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
    /* store-utility-card spec: tile-1, hairline border, rounded-lg (18px) */
    <div className="relative h-[420px] overflow-hidden rounded-[18px] border border-white/10 bg-[#272729] lg:h-[520px]">
      {mounted ? (
        <Suspense fallback={<MapSkeleton />}>
          <MapClient {...props} showFloodZones={showFloodZones} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}

      {/* Tactical legend — utility card bottom left */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-[11px] border border-white/10 bg-[#272729]/95 px-3 py-2 backdrop-blur">
        <p
          className="mb-1.5 font-mono font-semibold uppercase text-white/40"
          style={{ fontSize: 9, letterSpacing: "0.08em", lineHeight: 1 }}
        >
          [LEGEND_PRIORITY]
        </p>
        <div className="flex flex-col gap-0.5">
          {legend.map((p) => (
            <div key={p} className="flex items-center gap-2 font-mono text-[10px] text-white/70">
              <span className="size-2 rounded-full" style={{ backgroundColor: priorityColor[p] }} />
              {priorityLabel[p]}
            </div>
          ))}
        </div>
        <div className="my-1.5 h-px bg-white/8" />
        <p
          className="mb-1 font-mono font-semibold uppercase text-white/40"
          style={{ fontSize: 9, letterSpacing: "0.08em", lineHeight: 1 }}
        >
          [LEGEND_STATUS]
        </p>
        <div className="flex flex-col gap-0.5">
          {(["rescue", "medical", "resolved", "spam"] as const).map((s) => (
            <div key={s} className="flex items-center gap-2 font-mono text-[10px] text-white/70">
              <span className="size-2 rounded-full" style={{ backgroundColor: statusColor[s] }} />
              {statusLabel[s]}
            </div>
          ))}
        </div>
      </div>

      {/* Flood zone toggle — dark utility button top right */}
      <button
        onClick={() => setShowFloodZones((v) => !v)}
        className={`absolute right-3 top-3 z-[500] flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-colors cursor-pointer ${
          showFloodZones
            ? "border-[#0066cc]/40 bg-[#0066cc]/15 text-[#2997ff]"
            : "border-white/10 bg-[#272729]/90 text-white/50 hover:text-white"
        }`}
      >
        <Waves className="size-3" />
        Flood Risk Zones
        {showFloodZones && <span className="size-1.5 animate-pulse rounded-full bg-[#2997ff]" />}
      </button>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center font-mono text-xs text-white/40">
      [INIT_MAP] Loading tactical map...
    </div>
  );
}
