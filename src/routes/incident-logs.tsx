import { createFileRoute } from "@tanstack/react-router";
import { PriorityBadge } from "@/components/PriorityBadge";
import { incidents } from "@/lib/incidents";

export const Route = createFileRoute("/incident-logs")({
  head: () => ({
    meta: [
      { title: "Incident Logs — RescuAI" },
      {
        name: "description",
        content: "Chronological log of reported incidents, districts and affected populations.",
      },
      { property: "og:title", content: "Incident Logs — RescuAI" },
      { property: "og:description", content: "Auditable record of every reported incident." },
    ],
  }),
  component: Logs,
});

function Logs() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#272729]">
      <table className="w-full text-[13px]">
        <thead>
          <tr
            className="border-b border-white/8 text-left font-mono uppercase text-white/40"
            style={{ fontSize: 9, letterSpacing: "0.08em" }}
          >
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Incident</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Type</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">District</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 text-right font-medium">Age</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/6">
          {incidents.map((i) => (
            <tr key={i.id} className="transition-colors hover:bg-white/4">
              <td className="px-4 py-3 font-mono text-[10px] text-white/40">{i.id}</td>
              <td className="px-4 py-3 text-white/85">{i.title}</td>
              <td className="hidden px-4 py-3 text-white/50 sm:table-cell">{i.type}</td>
              <td className="hidden px-4 py-3 text-white/50 md:table-cell">{i.district}</td>
              <td className="px-4 py-3">
                <PriorityBadge priority={i.priority} />
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] text-white/40">
                {i.minutesAgo}m
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
