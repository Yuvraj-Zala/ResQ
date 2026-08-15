import { Radio, WifiOff, Activity } from "lucide-react";
import { useOfflineMesh } from "@/context/OfflineMeshContext";

export function MeshModeToggle() {
  const { isMeshMode, toggleMeshMode } = useOfflineMesh();

  return (
    <div className="flex items-center gap-2">
      {/* Dynamic Status Indicator — Action Blue on dark surface */}
      {isMeshMode ? (
        <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#0066cc]/40 bg-[#0066cc]/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#2997ff] ring-1 ring-[#0066cc]/20 animate-pulse">
          <WifiOff className="size-2.5 text-[#2997ff]" />
          NETWORK: OFFLINE MESH (LoRa/P2P ACTIVE)
        </span>
      ) : (
        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-success">
          <Activity className="size-3" />
          LATENCY: 24ms
        </span>
      )}

      {/* Mesh Mode Toggle Switch — dark utility button */}
      <button
        type="button"
        onClick={toggleMeshMode}
        aria-pressed={isMeshMode}
        className={`inline-flex items-center gap-1.5 rounded-[8px] border px-2 py-0.8 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
          isMeshMode
            ? "border-[#0066cc]/50 bg-[#0066cc]/15 text-[#2997ff] ring-1 ring-[#0066cc]/30"
            : "border-white/10 bg-[#272729]/80 text-white/50 hover:border-[#0066cc]/40 hover:text-white"
        }`}
        title={isMeshMode ? "Disable LoRa Mesh Mode" : "Enable Emergency LoRa Mesh Mode"}
      >
        <Radio
          className={`size-3 ${isMeshMode ? "animate-spin text-[#2997ff]" : "text-white/40"}`}
        />
        <span>{isMeshMode ? "[MESH ACTIVE]" : "[MESH NETWORK]"}</span>
        <span
          className={`size-1.5 rounded-full transition-colors ${
            isMeshMode ? "bg-[#2997ff] shadow-[0_0_8px_rgba(41,151,255,0.9)]" : "bg-white/30"
          }`}
        />
      </button>
    </div>
  );
}
