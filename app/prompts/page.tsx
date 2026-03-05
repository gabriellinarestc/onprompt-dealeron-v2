"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PromptsShell } from "@/features/prompts/PromptsShell"

export default function PromptsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <PromptsShell />
      </div>
    </DashboardShell>
  )
}
