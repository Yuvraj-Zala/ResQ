import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Radio, Map, ScrollText, Send, Circle } from "lucide-react";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Live Feeds", url: "/live-feeds", icon: Radio },
  { title: "Incident Map", url: "/heatmap", icon: Map },
  { title: "Incident Logs", url: "/incident-logs", icon: ScrollText },
  { title: "Dispatch Center", url: "/dispatch-center", icon: Send },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="sticky top-0 hidden h-screen w-52 shrink-0 flex-col border-r border-border bg-black md:flex">
      {/* ── Brand ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 shrink-0">
        <img src="/logo.png" alt="ResQ" className="size-8 rounded object-contain" />
        <div>
          <p className="text-[13px] font-bold tracking-tight text-foreground">
            Res<span className="text-primary">Q</span>
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight">Disaster Intelligence</p>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Operations
        </p>
        {navItems.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-2.5 rounded px-3 py-2 text-[12px] font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              <item.icon
                className={`size-3.5 ${active ? "text-primary" : "text-muted-foreground"}`}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── System status footer ───────────────────────────────────────────── */}
      <div className="border-t border-border px-3 py-3 space-y-3 shrink-0">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
            System Status
          </p>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Circle className="size-1.5 fill-success text-success" />
            <span className="text-success font-medium">Online</span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
            Connected Sources
          </p>
          <div className="flex items-center gap-2 rounded border border-success/20 bg-success/5 px-2 py-1">
            <Circle className="size-1.5 fill-success text-success" />
            <span className="text-[11px] font-medium text-success">4/4 Feeds Live</span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Operator
          </p>
          <p className="text-[11px] text-foreground font-medium">NDRF Unit 06</p>
          <p className="text-[10px] text-muted-foreground">ID: NDRF-#4092</p>
        </div>
      </div>
    </aside>
  );
}
