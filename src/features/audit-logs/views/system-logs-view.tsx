"use client"

import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSystemLogs } from "../hooks/use-system-logs"
import { LogStatsCards } from "../components/log-stats-cards"
import { LogFilters } from "../components/log-filters"
import { LogTable } from "../components/log-table"
import { LogPagination } from "../components/log-pagination"

export function SystemLogsView() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    buildingFilter,
    setBuildingFilter,
    actionFilter,
    setActionFilter,
    triggerFilter,
    setTriggerFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredLogsCount,
    paginatedLogs,
    stats,
    userRole,
    assignedGedungName,
  } = useSystemLogs()

  const isSuperAdmin = userRole === "SUPER_ADMIN"

  const handleResetFilters = () => {
    setSearchQuery("")
    setDateFilter("all")
    setActionFilter("all")
    setTriggerFilter("all")
    if (isSuperAdmin) {
      setBuildingFilter("all")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Dinamis Berbasis Peran (Kepatuhan PRD & SDD) */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <FileText className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
            {isSuperAdmin ? "System Audit Logs" : "Activity Logs"}
          </h1>
          <p className="text-[11px] md:text-sm text-muted-foreground truncate md:whitespace-normal">
            <span className="hidden md:inline">
              {isSuperAdmin
                ? "Automation history and global campus-wide activity records "
                : `Device activity records for ${assignedGedungName} `}
            </span>
            <span className="md:hidden">
              {isSuperAdmin ? "Global records " : `${assignedGedungName} records `}
            </span>
            (Last 30 days)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <LogStatsCards stats={stats} />

      {/* Logs Table Card */}
      <Card className="bg-background border-zinc-800">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-end gap-4 md:gap-0 pb-4 md:pb-2">
          <LogFilters
            query={searchQuery}
            onQueryChange={setSearchQuery}
            filter={dateFilter}
            onFilterChange={setDateFilter}
            actionFilter={actionFilter}
            onActionFilterChange={setActionFilter}
            triggerFilter={triggerFilter}
            onTriggerFilterChange={setTriggerFilter}
            userRole={userRole}
            buildingFilter={buildingFilter}
            onBuildingFilterChange={setBuildingFilter}
            onResetFilters={handleResetFilters}
          />
        </CardHeader>

        <CardContent>
          <LogTable loading={loading} logs={paginatedLogs} />
          
          <LogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={filteredLogsCount}
            currentCount={paginatedLogs.length}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
