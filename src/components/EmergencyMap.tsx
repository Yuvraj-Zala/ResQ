import { Suspense, lazy, useEffect, useState } from "react";
import { Layers, MapIcon } from "lucide-react";
import { priorityColor, priorityLabel, type Priority } from "@/lib/incidents";
import { statusColor, statusLabel } from "@/lib/ops";
import type { MapProps } from "./EmergencyMapInner";

const MapClient = lazy(() => import("./EmergencyMapInner"));

const legend: Priority[] = ["critical", "high", "moderate", "low"];

export function EmergencyMap(props: MapProps) {
  const [mounted, setMounted] = useState(false);
  const [showFloodZones, setShowFloodZones] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative h-[360px] overflow-hidden rounded border border-border bg-card lg:h-[480px]">
      {mounted ? (
        <Suspense fallback={<MapSkeleton />}>
          <MapClient {...props} showFloodZones={showFloodZones} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}

      {/* ── Map controls ──────────────────────────────────────────────────────── */}
      <div className="absolute right-3 top-3 z-[500] flex items-center gap-1.5">
        <button
          onClick={() => setShowFloodZones((v) => !v)}
          className={`flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
            showFloodZones
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-[#0B1117]/90 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="size-3" />
          Flood Zones
        </button>
        <button
          onClick={() => setLegendOpen((v) => !v)}
          className={`flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
            legendOpen
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-[#0B1117]/90 text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapIcon className="size-3" />
          Legend
        </button>
      </div>

      {/* ── Map legend drawer ─────────────────────────────────────────────────── */}
      {legendOpen && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded border border-border bg-[#0B1117]/95 px-3 py-2 backdrop-blur">
          <p className="eoc-label mb-1.5">Severity</p>
          <div className="flex flex-col gap-0.5">
            {legend.map((p) => (
              <div key={p} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-sm" style={{ backgroundColor: priorityColor[p] }} />
                {priorityLabel[p]}
              </div>
            ))}
          </div>
          <div className="my-1.5 h-px bg-border" />
          <p className="eoc-label mb-1">Status</p>
          <div className="flex flex-col gap-0.5">
            {(["rescue", "medical", "resolved"] as const).map((s) => (
              <div key={s} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-sm" style={{ backgroundColor: statusColor[s] }} />
                {statusLabel[s]}
              </div>
            ))}
          </div>
          <div className="my-1.5 h-px bg-border" />
          <p className="eoc-label mb-1">Facilities</p>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="inline-block size-2 rounded-sm border-2 border-primary bg-primary/30" />
              Hospital
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="inline-block size-2 rounded-sm border-2 border-success bg-success/30" />
              Shelter / Relief
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center text-[11px] text-muted-foreground">
      Loading tactical map...
    </div>
  );
}
