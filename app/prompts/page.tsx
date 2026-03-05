"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PromptsContent } from "@/components/dashboard/prompts-content"

export default function PromptsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <PromptsContent />
      </div>
    </DashboardShell>
  )
}
