import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CrawlerLogsShell } from "@/features/crawlerLogs/CrawlerLogsShell"

export default function CrawlerLogsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <CrawlerLogsShell />
      </div>
    </DashboardShell>
  )
}
