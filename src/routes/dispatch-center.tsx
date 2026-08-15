import { createFileRoute } from "@tanstack/react-router";
import { Truck, Users, Timer } from "lucide-react";
import { incidents } from "@/lib/incidents";
import { PriorityBadge } from "@/components/PriorityBadge";

export const Route = createFileRoute("/dispatch-center")({
  head: () => ({
    meta: [
      { title: "Dispatch Center — RescuAI Ahmedabad" },
      {
        name: "description",
        content: "Assign response units, track ETAs and coordinate rescue teams across Ahmedabad.",
      },
      { property: "og:title", content: "Dispatch Center — RescuAI Ahmedabad" },
      {
        property: "og:description",
        content: "Coordinate units and track rescue ETAs in real time.",
      },
    ],
  }),
  component: Dispatch,
});

const units = [
  { id: "UNIT-12", crew: 6, status: "En route", eta: "4 min" },
  { id: "UNIT-07", crew: 4, status: "On scene", eta: "—" },
  { id: "UNIT-21", crew: 8, status: "Standby", eta: "—" },
  { id: "UNIT-33", crew: 5, status: "Returning", eta: "12 min" },
];

function Dispatch() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-[18px] border border-white/10 bg-[#272729]">
        <div className="border-b border-white/8 px-4 py-3">
          <p
            className="font-mono uppercase text-white/40"
            style={{ fontSize: 9, letterSpacing: "0.06em", lineHeight: 1 }}
          >
            [DISPATCH_UNASSIGNED]
          </p>
          <h2
            className="mt-1 text-white"
            style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.374px", lineHeight: 1.29 }}
          >
            Unassigned Incidents
          </h2>
        </div>
        <ul className="divide-y divide-white/6">
          {incidents.slice(0, 6).map((i) => (
            <li key={i.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-white/85">{i.title}</p>
                <p className="font-mono text-[10px] text-white/40">
                  {i.id} · {i.district} · {i.people} affected
                </p>
              </div>
              <PriorityBadge priority={i.priority} />
              <button className="rounded-full bg-[#0066cc] px-3 py-1 text-[11px] font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95 cursor-pointer">
                Dispatch
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[18px] border border-white/10 bg-[#272729]">
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
          <Truck className="size-3.5 text-[#2997ff]" />
          <div>
            <p
              className="font-mono uppercase text-white/40"
              style={{ fontSize: 9, letterSpacing: "0.06em", lineHeight: 1 }}
            >
              [UNITS_FIELD]
            </p>
            <h2
              className="mt-1 text-white"
              style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.374px", lineHeight: 1.29 }}
            >
              Response Units
            </h2>
          </div>
        </div>
        <ul className="divide-y divide-white/6">
          {units.map((u) => (
            <li key={u.id} className="px-4 py-3">
              <p className="font-mono text-[11px] text-white/85">{u.id}</p>
              <div className="mt-1 flex items-center gap-3 font-mono text-[10px] text-white/40">
                <span className="flex items-center gap-1">
                  <Users className="size-2.5" />
                  {u.crew}
                </span>
                <span>{u.status}</span>
                <span className="flex items-center gap-1">
                  <Timer className="size-2.5" />
                  {u.eta}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
