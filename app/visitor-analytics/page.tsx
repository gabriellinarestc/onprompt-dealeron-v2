import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VisitorAnalyticsShell } from "@/features/visitorAnalytics/VisitorAnalyticsShell"

export default function VisitorAnalyticsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <VisitorAnalyticsShell />
      </div>
    </DashboardShell>
  )
}
