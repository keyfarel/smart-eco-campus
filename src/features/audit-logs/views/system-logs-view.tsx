"use client"

import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useSystemLogs } from "../hooks/use-system-logs"
import { LogStatsCards } from "../components/log-stats-cards"
import { LogFilters } from "../components/log-filters"
import { LogTable } from "../components/log-table"
import { LogPagination } from "../components/log-pagination"

export function SystemLogsView() {
  const logState = useSystemLogs()

  return (
    <div className="flex flex-col gap-6">
      {/* Header Dinamis Berbasis Peran (Kepatuhan PRD & SDD) */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <FileText className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
            {logState.isSuperAdmin ? "System Audit Logs" : "Activity Logs"}
          </h1>
          <p className="text-[11px] md:text-sm text-muted-foreground truncate md:whitespace-normal">
            <span className="hidden md:inline">
              {logState.isSuperAdmin
                ? "Automation history and global campus-wide activity records "
                : `Device activity records for ${logState.assignedGedungName} `}
            </span>
            <span className="md:hidden">
              {logState.isSuperAdmin ? "Global records " : `${logState.assignedGedungName} records `}
            </span>
            (Last 30 days)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <LogStatsCards stats={logState.stats} />

      {/* Logs Table Card */}
      <Card className="bg-background border-zinc-800">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-end gap-4 md:gap-0 pb-4 md:pb-2">
          <LogFilters
            query={logState.searchQuery}
            onQueryChange={logState.setSearchQuery}
            filter={logState.dateFilter}
            onFilterChange={logState.setDateFilter}
            actionFilter={logState.actionFilter}
            onActionFilterChange={logState.setActionFilter}
            triggerFilter={logState.triggerFilter}
            onTriggerFilterChange={logState.setTriggerFilter}
            userRole={logState.userRole}
            buildingFilter={logState.buildingFilter}
            onBuildingFilterChange={logState.setBuildingFilter}
            onResetFilters={logState.handleResetFilters}
          />
        </CardHeader>

        <CardContent>
          <LogTable loading={logState.loading} logs={logState.paginatedLogs} />
          
          <LogPagination
            currentPage={logState.currentPage}
            totalPages={logState.totalPages}
            totalCount={logState.filteredLogsCount}
            currentCount={logState.paginatedLogs.length}
            onPageChange={logState.setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
