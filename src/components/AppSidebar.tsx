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
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-white/8 bg-black md:flex">
      {/* Logo — global-nav spec: surface-black bg, on-dark text */}
      <div className="flex items-center gap-2.5 border-b border-white/8 px-4 py-3" style={{ minHeight: 52 }}>
        <div className="grid size-8 place-items-center rounded-lg bg-[#0066cc]">
          <ShieldAlert className="size-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">
            RESCU<span className="text-[#2997ff]">AI</span>
          </p>
          <p
            className="text-white/50"
            style={{ fontSize: 10, letterSpacing: "-0.08px", lineHeight: 1.3 }}
          >
            Disaster Intelligence
          </p>
        </div>
      </div>

      {/* Nav — nav-link spec: 12px/400/−0.12px */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <p
          className="px-3 pb-2 uppercase text-white/30"
          style={{ fontSize: 10, fontWeight: 400, letterSpacing: "0.12em", lineHeight: 1 }}
        >
          Operations
        </p>
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-2.5 rounded-sm px-3 py-2 transition-colors ${
                active
                  ? "text-[#2997ff]"           /* Sky Link Blue on dark surface */
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontSize: 12, fontWeight: 400, letterSpacing: "-0.12px", lineHeight: 1 }}
            >
              <item.icon className={`size-3.5 ${active ? "text-[#2997ff]" : "text-white/40"}`} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Regional Status card — store-utility-card spec */}
      <div
        className="m-3 rounded-[18px] border border-white/8 bg-[#272729] p-4"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Waves className="size-3 text-destructive" />
          <p className="text-white" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.12px" }}>
            Regional Status
          </p>
        </div>
        <p className="text-[#cccccc]" style={{ fontSize: 12, fontWeight: 400, lineHeight: 1.43, letterSpacing: "-0.12px" }}>
          Monsoon surge active. 3 wards under evacuation advisory near Sabarmati basin.
        </p>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[72%] rounded-full bg-destructive" />
        </div>
        <p className="mt-2 text-white/40" style={{ fontSize: 10, letterSpacing: "0.04em" }}>
          SYS_LOAD · 72%
        </p>
      </div>
    </aside>
  );
}
