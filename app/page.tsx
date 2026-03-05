"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardFeatureShell } from "@/features/dashboard/DashboardShell"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <DashboardFeatureShell />
      </div>
    </DashboardShell>
  )
}
