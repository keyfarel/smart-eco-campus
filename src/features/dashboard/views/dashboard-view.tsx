"use client";

import { DashboardHeader } from "../components/dashboard-header";
import { useDashboard } from "../hooks/use-dashboard";

/**
 * DashboardView - Main entry point for the Dashboard feature.
 * Adheres to:
 * - Rule #5: kebab-case filename, PascalCase function.
 * - Rule #7: Fat view decomposition (Logic in hook, UI in components).
 * - Rule #8: Relative imports for internal feature files.
 */
export default function DashboardView() {
  const { lastUpdate } = useDashboard();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Background Ambient Glow (Rule #3) */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />
      
      <DashboardHeader />

      <main className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
          <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider">
            Status
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-1">
            System Online
          </h3>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: <span className="tabular-nums">{lastUpdate}</span>
          </p>
        </div>
      </main>
    </div>
  );
}
