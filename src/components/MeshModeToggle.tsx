import { Radio, WifiOff, Circle } from "lucide-react";
import { useOfflineMesh } from "@/context/OfflineMeshContext";

export function MeshModeToggle() {
  const { isMeshMode, toggleMeshMode } = useOfflineMesh();

  if (!isMeshMode) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-success">
        <Circle className="size-1 fill-success text-success" />
        NETWORK ONLINE
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded border border-warning/30 bg-warning/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-warning">
        <WifiOff className="size-2.5" />
        MESH MODE
      </span>
      <button
        type="button"
        onClick={toggleMeshMode}
        className="inline-flex items-center gap-1 rounded border border-warning/30 bg-warning/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-warning transition-colors hover:bg-warning/15 cursor-pointer"
        title="Disable LoRa Mesh Mode"
      >
        <Radio className="size-2.5" />
        <span>OFFLINE</span>
      </button>
    </div>
  );
}
