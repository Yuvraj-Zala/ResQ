import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Radio,
  Flame,
  ScrollText,
  Send,
  ShieldAlert,
  Waves,
} from "lucide-react";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Live Feeds", url: "/live-feeds", icon: Radio },
  { title: "Heatmap", url: "/heatmap", icon: Flame },
  { title: "Incident Logs", url: "/incident-logs", icon: ScrollText },
  { title: "Dispatch Center", url: "/dispatch-center", icon: Send },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
        <div className="grid size-8 place-items-center rounded-sm bg-primary/10 ring-1 ring-primary/20">
          <ShieldAlert className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-foreground">
            RESCU<span className="text-primary">AI</span>
          </p>
          <p className="text-[10px] text-muted-foreground">Disaster Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        <p className="px-3 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Operations
        </p>
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-2.5 rounded-sm px-3 py-2 text-[13px] transition-colors ${
                active
                  ? "bg-primary/10 text-foreground ring-1 ring-inset ring-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className={`size-3.5 ${active ? "text-primary" : ""}`} />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-2 rounded-sm border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Waves className="size-3.5 text-destructive" />
          <p className="text-[11px] font-semibold text-foreground">Regional Status</p>
        </div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
          Monsoon surge active. 3 wards under evacuation advisory.
        </p>
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-sm bg-muted">
          <div className="h-full w-[72%] rounded-sm bg-destructive" />
        </div>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          Load 72%
        </p>
      </div>
    </aside>
  );
}
