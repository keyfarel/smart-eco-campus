import { LayoutDashboard } from "lucide-react";

/**
 * Simple sub-component for Dashboard View.
 * Adheres to rule #6: Single-view feature component placement.
 */
export const DashboardHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
        <LayoutDashboard className="w-6 h-6 text-emerald-500" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          System Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring of campus efficiency.
        </p>
      </div>
    </div>
  );
};
