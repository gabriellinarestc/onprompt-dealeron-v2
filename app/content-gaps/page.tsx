"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContentGapsDetail } from "@/components/dashboard/content-gaps-detail"

export default function ContentGapsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <ContentGapsDetail />
      </div>
    </DashboardShell>
  )
}
