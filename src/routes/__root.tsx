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
import { ShieldHalf, FileText, Circle } from "lucide-react";
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
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-lg font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-primary"
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
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
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
            className="btn-primary"
          >
            Try again
          </button>
          <a
            href="/"
            className="btn-secondary"
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
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
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
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ── Top command status bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-4 border-b border-border bg-[#080d14] px-4 py-1.5 text-[11px] uppercase tracking-wider overflow-x-auto shrink-0">
          <span className="flex items-center gap-1.5 font-semibold text-foreground shrink-0">
            <ShieldHalf className="size-3.5 text-primary" />
            GSDMA / NDRF UNIT 06
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5 shrink-0">
            <Circle className="size-1.5 fill-success text-success" />
            <span className="text-success font-medium">SYSTEM OPERATIONAL</span>
          </span>
          <span className="text-border">|</span>
          <span className="shrink-0 text-muted-foreground font-medium">{sector}</span>
          <span className="text-border">|</span>
          <MeshModeToggle />
          <span className="text-border">|</span>
          <span className="shrink-0 font-mono text-muted-foreground">{istTime} IST</span>
          {activationLevel && (
            <>
              <span className="text-border">|</span>
              <span className="shrink-0 flex items-center gap-1 text-destructive font-medium">
                {activationLevel}
              </span>
            </>
          )}
        </div>

        {/* ── Sub header ────────────────────────────────────────────────────── */}
        <header
          className="flex items-center justify-between gap-4 border-b border-border bg-[#080d14] px-4 py-2 shrink-0"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-[13px] font-semibold text-foreground tracking-tight">
              Disaster Intelligence &amp; Response Support
            </h1>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Command Console · Ahmedabad Central
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DemoPresetsControl />
            <button
              type="button"
              onClick={handleExportSitrep}
              disabled={isExporting}
              className="btn-secondary disabled:opacity-50"
              title="Export GSDMA Official Situation Report PDF"
            >
              <FileText className="size-3.5" />
              <span className="hidden sm:inline">{isExporting ? "GENERATING..." : "EXPORT SITREP"}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
