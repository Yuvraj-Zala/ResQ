import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import type { IncidentStatus } from "@/lib/ops";

interface OfflineAction {
  id: string;
  status: IncidentStatus;
  timestamp: number;
  node: string;
}

interface OfflineMeshContextType {
  isMeshMode: boolean;
  toggleMeshMode: () => void;
  meshNodeId: string;
  offlineStatuses: Record<string, IncidentStatus>;
  saveOfflineStatus: (id: string, status: IncidentStatus) => void;
  offlineQueue: OfflineAction[];
}

const OfflineMeshContext = createContext<OfflineMeshContextType | undefined>(undefined);

const STORAGE_KEY_MESH = "rescuai_mesh_mode_enabled";
const STORAGE_KEY_STATUSES = "rescuai_offline_statuses";
const STORAGE_KEY_QUEUE = "rescuai_offline_queue";

export function OfflineMeshProvider({ children }: { children: ReactNode }) {
  const [isMeshMode, setIsMeshMode] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(STORAGE_KEY_MESH) === "true";
      }
    } catch {
      /* silent */
    }
    return false;
  });

  const [offlineStatuses, setOfflineStatuses] = useState<Record<string, IncidentStatus>>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY_STATUSES);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      /* silent */
    }
    return {};
  });

  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY_QUEUE);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      /* silent */
    }
    return [];
  });

  const meshNodeId = "LORA NODE #04";

  const toggleMeshMode = useCallback(() => {
    setIsMeshMode((prev) => {
      const next = !prev;
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_MESH, String(next));
        }
      } catch {
        /* silent */
      }

      if (next) {
        toast.success("Switched to Emergency LoRa Mesh Network. Data synchronized locally.", {
          description: "Operating in P2P mesh relay mode. All actions saved to offline storage.",
          duration: 4000,
        });
      } else {
        toast.info("Reconnected to Central Command Network.", {
          description: "Online link active. Telemetry synced with GSDMA HQ.",
          duration: 3000,
        });
      }
      return next;
    });
  }, []);

  const saveOfflineStatus = useCallback((id: string, status: IncidentStatus) => {
    setOfflineStatuses((prev) => {
      const updated = { ...prev, [id]: status };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(updated));
        }
      } catch {
        /* silent */
      }
      return updated;
    });

    setOfflineQueue((prev) => {
      const action: OfflineAction = {
        id,
        status,
        timestamp: Date.now(),
        node: meshNodeId,
      };
      const updated = [action, ...prev.filter((a) => a.id !== id)].slice(0, 50);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(updated));
        }
      } catch {
        /* silent */
      }
      return updated;
    });
  }, [meshNodeId]);

  return (
    <OfflineMeshContext.Provider
      value={{
        isMeshMode,
        toggleMeshMode,
        meshNodeId,
        offlineStatuses,
        saveOfflineStatus,
        offlineQueue,
      }}
    >
      {children}
    </OfflineMeshContext.Provider>
  );
}

export function useOfflineMesh() {
  const ctx = useContext(OfflineMeshContext);
  if (!ctx) {
    throw new Error("useOfflineMesh must be used within an OfflineMeshProvider");
  }
  return ctx;
}
