"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContentGapsShell } from "@/features/contentGaps/ContentGapsShell"

export default function ContentGapsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <ContentGapsShell />
      </div>
    </DashboardShell>
  )
}
