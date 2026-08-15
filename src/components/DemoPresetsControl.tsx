import { useState } from "react";
import { Waves, ShieldAlert, Users, Play, ChevronDown, RotateCcw, Sparkles } from "lucide-react";
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
    <div className="flex items-center gap-1.5 font-mono text-[10px]">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-[8px] border px-2 py-0.8 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
              activeScenario
                ? "border-[#0066cc]/60 bg-[#0066cc]/15 text-[#2997ff] ring-1 ring-[#0066cc]/30"
                : "border-white/10 bg-[#272729]/80 text-white/50 hover:border-[#0066cc]/40 hover:text-white"
            }`}
          >
            <Sparkles
              className={`size-3 ${activeScenario ? "animate-pulse text-[#2997ff]" : "text-white/40"}`}
            />
            <span>
              {activeScenario
                ? `[PRESET: ${scenarioInfo?.shortName.toUpperCase()}]`
                : "[DEMO PRESETS]"}
            </span>
            <ChevronDown className="size-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 border border-white/10 bg-[#1d1d1f] p-1.5">
          <DropdownMenuLabel className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-white/40">
            Operational Disaster Scenarios
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />

          {/* 1. Flood Surge */}
          <DropdownMenuItem
            onClick={() => handleSelect("flood")}
            className={`cursor-pointer rounded-[8px] px-2 py-1.5 transition-colors ${
              activeScenario === "flood"
                ? "bg-[#0066cc]/15 text-[#2997ff] font-medium"
                : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-start gap-2 text-left">
              <Waves className="size-4 mt-0.5 shrink-0 text-[#2997ff]" />
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-[11px] text-white">
                  Flood Surge (Sabarmati)
                  {activeScenario === "flood" && (
                    <span className="size-1.5 rounded-full bg-[#2997ff] animate-ping" />
                  )}
                </div>
                <p className="text-[10px] leading-tight text-white/40">
                  Water rise on Riverfront, Sector 1 focus &amp; alert tone.
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* 2. Misinformation Attack */}
          <DropdownMenuItem
            onClick={() => handleSelect("misinfo")}
            className={`cursor-pointer rounded-[8px] px-2 py-1.5 transition-colors ${
              activeScenario === "misinfo"
                ? "bg-warning/15 text-warning font-medium"
                : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-start gap-2 text-left">
              <ShieldAlert className="size-4 mt-0.5 shrink-0 text-warning" />
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-[11px] text-white">
                  Misinformation Attack
                  {activeScenario === "misinfo" && (
                    <span className="size-1.5 rounded-full bg-warning animate-ping" />
                  )}
                </div>
                <p className="text-[10px] leading-tight text-white/40">
                  Viral panic claims with NLP Fake News verification.
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* 3. Mass Evacuation */}
          <DropdownMenuItem
            onClick={() => handleSelect("evacuation")}
            className={`cursor-pointer rounded-[8px] px-2 py-1.5 transition-colors ${
              activeScenario === "evacuation"
                ? "bg-success/15 text-success font-medium"
                : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-start gap-2 text-left">
              <Users className="size-4 mt-0.5 shrink-0 text-success" />
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-[11px] text-white">
                  Mass Evacuation (Vasna)
                  {activeScenario === "evacuation" && (
                    <span className="size-1.5 rounded-full bg-success animate-ping" />
                  )}
                </div>
                <p className="text-[10px] leading-tight text-white/40">
                  Vasna Barrage gate discharge, convoy evacuations.
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          {activeScenario && (
            <>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={resetScenario}
                className="cursor-pointer rounded-[8px] px-2 py-1.5 text-white/40 hover:bg-destructive/10 hover:text-destructive"
              >
                <RotateCcw className="size-3.5 mr-1.5" />
                <span className="font-mono text-[10px]">Reset to Live Baseline Stream</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Direct Scenario Pill Buttons for ultra-fast 1-click access */}
      <div className="hidden 2xl:flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleSelect("flood")}
          className={`rounded-[8px] border px-1.5 py-0.5 text-[9px] font-mono transition-colors cursor-pointer ${
            activeScenario === "flood"
              ? "border-[#0066cc]/60 bg-[#0066cc]/20 text-[#2997ff]"
              : "border-white/10 text-white/50 hover:border-[#0066cc]/40 hover:text-white"
          }`}
          title="Trigger Sabarmati Flood Surge Scenario"
        >
          Flood
        </button>
        <button
          type="button"
          onClick={() => handleSelect("misinfo")}
          className={`rounded-[8px] border px-1.5 py-0.5 text-[9px] font-mono transition-colors cursor-pointer ${
            activeScenario === "misinfo"
              ? "border-warning/60 bg-warning/20 text-warning"
              : "border-white/10 text-white/50 hover:border-warning/40 hover:text-white"
          }`}
          title="Trigger Misinformation Attack Scenario"
        >
          Misinfo
        </button>
        <button
          type="button"
          onClick={() => handleSelect("evacuation")}
          className={`rounded-[8px] border px-1.5 py-0.5 text-[9px] font-mono transition-colors cursor-pointer ${
            activeScenario === "evacuation"
              ? "border-success/60 bg-success/20 text-success"
              : "border-white/10 text-white/50 hover:border-success/40 hover:text-white"
          }`}
          title="Trigger Vasna Mass Evacuation Scenario"
        >
          Evac
        </button>
        {activeScenario && (
          <button
            type="button"
            onClick={resetScenario}
            className="rounded-[8px] border border-white/10 px-1 py-0.5 text-[9px] font-mono text-white/50 hover:text-white"
            title="Reset Scenario"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
