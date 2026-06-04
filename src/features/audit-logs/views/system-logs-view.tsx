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

  return (
    <div className="flex flex-col gap-6">
      {/* Header Dinamis Berbasis Peran (Kepatuhan PRD & SDD) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <FileText className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isSuperAdmin ? "System Audit Logs" : "Activity Logs"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSuperAdmin
              ? "Automation history and global campus-wide activity records (Last 30 days)"
              : `Device activity records for ${assignedGedungName} (Last 30 days)`}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <LogStatsCards stats={stats} />

      {/* Logs Table Card */}
      <Card className="bg-background border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-zinc-200">
            {isSuperAdmin ? "Global Activity Records" : "Local Activity Records"}
          </CardTitle>
          <LogFilters
            query={searchQuery}
            onQueryChange={setSearchQuery}
            filter={dateFilter}
            onFilterChange={setDateFilter}
            userRole={userRole}
            buildingFilter={buildingFilter}
            onBuildingFilterChange={setBuildingFilter}
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
