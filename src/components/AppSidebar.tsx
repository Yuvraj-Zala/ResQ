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
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid size-9 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <ShieldAlert className="size-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-widest text-foreground">RESCU<span className="text-primary">AI</span></p>
          <p className="text-[11px] text-muted-foreground">Disaster Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Operations
        </p>
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-primary/12 text-foreground ring-1 ring-primary/25"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className={`size-4 ${active ? "text-primary" : ""}`} />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Waves className="size-4 text-primary" />
          <p className="text-xs font-semibold text-foreground">Regional Status</p>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Monsoon surge active. 3 wards under evacuation advisory.
        </p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[72%] rounded-full bg-destructive" />
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Load 72%
        </p>
      </div>
    </aside>
  );
}
