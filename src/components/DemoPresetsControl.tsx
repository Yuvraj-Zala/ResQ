import { useState } from "react";
import { Waves, ShieldAlert, Users, ChevronDown, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemoScenario, type ScenarioType } from "@/context/DemoScenarioContext";

export function DemoPresetsControl() {
  const { activeScenario, scenarioInfo, triggerScenario, resetScenario } = useDemoScenario();
  const [open, setOpen] = useState(false);

  const handleSelect = (scenario: ScenarioType) => {
    triggerScenario(scenario);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-1 font-mono text-[10px]">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-medium transition-colors cursor-pointer ${
              activeScenario
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
            }`}
          >
            <span>{activeScenario ? scenarioInfo?.shortName.toUpperCase() : "SCENARIOS"}</span>
            <ChevronDown className="size-2.5 opacity-60" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60 rounded border border-border bg-card p-1">
          <DropdownMenuLabel className="px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Disaster Scenarios
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem
            onClick={() => handleSelect("flood")}
            className={`cursor-pointer rounded px-2 py-1.5 ${
              activeScenario === "flood"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start gap-2 text-left">
              <Waves className="size-3.5 mt-0.5 shrink-0 text-primary" />
              <div>
                <div className="text-[11px] font-medium text-foreground">
                  Flood Surge (Sabarmati)
                  {activeScenario === "flood" && (
                    <span className="ml-1.5 size-1.5 inline-block rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">Water rise, Sector 1 focus.</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSelect("misinfo")}
            className={`cursor-pointer rounded px-2 py-1.5 ${
              activeScenario === "misinfo"
                ? "bg-warning/10 text-warning"
                : "text-foreground hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start gap-2 text-left">
              <ShieldAlert className="size-3.5 mt-0.5 shrink-0 text-warning" />
              <div>
                <div className="text-[11px] font-medium text-foreground">
                  Misinformation Attack
                  {activeScenario === "misinfo" && (
                    <span className="ml-1.5 size-1.5 inline-block rounded-full bg-warning animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Viral panic claims, NLP verification.
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSelect("evacuation")}
            className={`cursor-pointer rounded px-2 py-1.5 ${
              activeScenario === "evacuation"
                ? "bg-success/10 text-success"
                : "text-foreground hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start gap-2 text-left">
              <Users className="size-3.5 mt-0.5 shrink-0 text-success" />
              <div>
                <div className="text-[11px] font-medium text-foreground">
                  Mass Evacuation (Vasna)
                  {activeScenario === "evacuation" && (
                    <span className="ml-1.5 size-1.5 inline-block rounded-full bg-success animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Barrage gate discharge, convoy ops.
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          {activeScenario && (
            <>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={resetScenario}
                className="cursor-pointer rounded px-2 py-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <RotateCcw className="size-3 mr-1.5" />
                <span className="text-[10px]">Reset to Live Baseline</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
