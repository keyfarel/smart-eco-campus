import { SuperAdminView } from "@/features/dashboard"
import { getAnalyticsData } from "@/features/analytics/services/analytics-service"

interface PageProps {
  searchParams: Promise<{ timeRange?: string }>
}

export default async function SuperAdminPage({ searchParams }: PageProps) {
  // Tunggu penyelesaian resolusi searchParams (Standar Next.js 15+)
  const resolvedParams = await searchParams
  const timeRange = resolvedParams.timeRange || "live"

  // Lakukan data fetching
  const { rawLogs, mainData, stats } = await getAnalyticsData(timeRange)

  return (
    <SuperAdminView
      timeRange={timeRange}
      rawLogs={rawLogs}
      mainData={mainData}
      analyticsStats={stats}
    />
  )
}
