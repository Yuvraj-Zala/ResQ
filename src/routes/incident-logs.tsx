import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PriorityBadge } from "@/components/PriorityBadge";
import { incidents } from "@/lib/incidents";
import { statusColor } from "@/lib/ops";

export const Route = createFileRoute("/incident-logs")({
  head: () => ({
    meta: [
      { title: "Incident Logs — ResQ" },
      {
        name: "description",
        content: "Chronological log of reported incidents, districts and affected populations.",
      },
      { property: "og:title", content: "Incident Logs — ResQ" },
      { property: "og:description", content: "Auditable record of every reported incident." },
    ],
  }),
  component: Logs,
});

function Logs() {
  return (
    <div className="space-y-3 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Incident Registry
          </p>
          <h2 className="text-[13px] font-semibold text-foreground mt-0.5">
            All Reported Incidents
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search incidents..."
              className="rounded border border-border bg-muted/30 pl-7 pr-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary w-48"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded bg-card">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                ID
              </th>
              <th className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Incident
              </th>
              <th className="hidden px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                Type
              </th>
              <th className="hidden px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                District
              </th>
              <th className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Severity
              </th>
              <th className="hidden px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground lg:table-cell">
                Status
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Age
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {incidents.map((i) => (
              <tr key={i.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{i.id}</td>
                <td className="px-3 py-2 text-foreground font-medium">{i.title}</td>
                <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">{i.type}</td>
                <td className="hidden px-3 py-2 text-muted-foreground md:table-cell">
                  {i.district}
                </td>
                <td className="px-3 py-2">
                  <PriorityBadge priority={i.priority} />
                </td>
                <td className="hidden px-3 py-2 lg:table-cell">
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: statusColor.new }}
                    />
                    Active
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground">
                  {i.minutesAgo}m
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
