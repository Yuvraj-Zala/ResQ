import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { OctagonAlert as AlertOctagon, ShieldHalf, FileText } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { generateAndDownloadSitrep } from "@/services/sitrepExporter";
import { DemoScenarioProvider, useDemoScenario } from "@/context/DemoScenarioContext";
import { OfflineMeshProvider } from "@/context/OfflineMeshContext";
import { DemoPresetsControl } from "@/components/DemoPresetsControl";
import { MeshModeToggle } from "@/components/MeshModeToggle";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#0066cc] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#0066cc] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-[#272729] px-5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function useISTClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(istTime);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RescuAI | GSDMA Command Center" },
      {
        name: "description",
        content:
          "RescuAI is a disaster intelligence and response support console for live alerts, rescue dispatch and city-wide incident mapping.",
      },
      { property: "og:title", content: "RescuAI — Disaster Intelligence & Response" },
      {
        property: "og:description",
        content: "Live alerts, rescue dispatch and city-wide incident mapping in one console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineMeshProvider>
        <DemoScenarioProvider>
          <RootLayoutInner />
        </DemoScenarioProvider>
      </OfflineMeshProvider>
    </QueryClientProvider>
  );
}

function RootLayoutInner() {
  const istTime = useISTClock();
  const [isExporting, setIsExporting] = useState(false);
  const { sector, activationLevel, stats } = useDemoScenario();

  const handleExportSitrep = () => {
    setIsExporting(true);
    try {
      generateAndDownloadSitrep({
        activeAlerts: stats.activeAlerts,
        highPriorityRescues: stats.highPriorityRescues,
        resolvedCases: stats.resolvedToday,
        connectedSources: stats.connectedSources,
        operatorId: "NDRF-#4092",
        sector: sector.replace(/^SECTOR:\s*/, ""),
      });
    } catch {
      /* silent fallback */
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Tactical telemetry strip — global-nav spec: surface-black, on-dark */}
        <div className="flex items-center gap-3 border-b border-white/8 bg-black px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/40 overflow-x-auto">
          {/* Agency emblem */}
          <span className="flex items-center gap-1.5 text-foreground shrink-0">
            <ShieldHalf className="size-3.5 text-primary" />
            GSDMA / NDRF UNIT 6
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5 text-success shrink-0">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            SYSTEM STATUS: ACTIVE
          </span>
          <span className="text-border">|</span>
          <span className="shrink-0">OPERATOR ID: NDRF-#4092</span>
          <span className="text-border">|</span>
          <span className="shrink-0 font-medium text-[#2997ff]">{sector}</span>

          {/* Right side: Mesh Mode, Latency, clock, alert */}
          <span className="ml-auto flex items-center gap-3 shrink-0">
            <MeshModeToggle />
            <span className="text-border hidden sm:inline">|</span>
            <span className="text-foreground hidden sm:inline">IST {istTime}</span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1 text-destructive">
              <AlertOctagon className="size-3" /> {activationLevel}
            </span>
          </span>
        </div>

        <header
          className="sticky top-0 z-[600] flex items-center justify-between gap-4 border-b border-white/8 px-4 py-2.5"
          style={{
            backdropFilter: "saturate(180%) blur(20px)",
            background: "rgba(245,245,247,0.06)",
          }}
        >
          <div>
            <h1
              className="text-white"
              style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.374px", lineHeight: 1.29 }}
            >
              Disaster Intelligence &amp; Response Support
            </h1>
            <p className="font-mono text-[10px] text-white/40">
              Command Console · Ahmedabad Central · Real-time Operations
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Demo Presets Control Panel */}
            <DemoPresetsControl />

            {/* SITREP Export Button — button-primary pill */}
            <button
              type="button"
              onClick={handleExportSitrep}
              disabled={isExporting}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0066cc] px-3.5 py-1.5 font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95 disabled:opacity-50"
              style={{ fontSize: 12, letterSpacing: "-0.12px", lineHeight: 1 }}
              title="Export GSDMA Official Situation Report PDF"
            >
              <FileText className="size-3.5" />
              <span>{isExporting ? "GENERATING..." : "EXPORT SITREP"}</span>
            </button>

            <span className="grid size-7 place-items-center rounded-[8px] border border-white/10 bg-[#252527] font-mono text-[10px] text-white">
              OP
            </span>
          </div>
        </header>

        <main className="flex-1 p-4">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
