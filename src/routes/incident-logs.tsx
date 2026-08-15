import { createFileRoute } from "@tanstack/react-router";
import { PriorityBadge } from "@/components/PriorityBadge";
import { incidents } from "@/lib/incidents";

export const Route = createFileRoute("/incident-logs")({
  head: () => ({
    meta: [
      { title: "Incident Logs — RescuAI" },
      { name: "description", content: "Chronological log of reported incidents, districts and affected populations." },
      { property: "og:title", content: "Incident Logs — RescuAI" },
      { property: "og:description", content: "Auditable record of every reported incident." },
    ],
  }),
  component: Logs,
});

function Logs() {
  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-border text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            <th className="px-3 py-2.5 font-medium">ID</th>
            <th className="px-3 py-2.5 font-medium">Incident</th>
            <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Type</th>
            <th className="hidden px-3 py-2.5 font-medium md:table-cell">District</th>
            <th className="px-3 py-2.5 font-medium">Priority</th>
            <th className="px-3 py-2.5 text-right font-medium">Age</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {incidents.map((i) => (
            <tr key={i.id} className="transition-colors hover:bg-accent/50">
              <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">{i.id}</td>
              <td className="px-3 py-2.5 text-foreground">{i.title}</td>
              <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell">{i.type}</td>
              <td className="hidden px-3 py-2.5 text-muted-foreground md:table-cell">{i.district}</td>
              <td className="px-3 py-2.5"><PriorityBadge priority={i.priority} /></td>
              <td className="px-3 py-2.5 text-right font-mono text-[11px] text-muted-foreground">{i.minutesAgo}m</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
