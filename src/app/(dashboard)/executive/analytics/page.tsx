import { AnalyticsView } from "@/features/analytics"
import { getAnalyticsData } from "@/features/analytics/services/analytics-service"

interface PageProps {
  searchParams: Promise<{ timeRange?: string }>
}

export default async function ExecutiveAnalyticsPage({ searchParams }: PageProps) {
  // Tunggu penyelesaian resolusi searchParams (Standar Next.js 15+)
  const resolvedParams = await searchParams
  const timeRange = resolvedParams.timeRange || "24h"

  // Lakukan data fetching dan kalkulasi daya langsung di Server
  const { rawLogs, mainData, stats } = await getAnalyticsData(timeRange)

  return (
    <AnalyticsView
      timeRange={timeRange}
      rawLogs={rawLogs}
      mainData={mainData}
      stats={stats}
    />
  )
}
