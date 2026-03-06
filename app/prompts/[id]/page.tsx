import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PromptDetailShell } from "@/features/promptDetail/PromptDetailShell"

export default function PromptDetailPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <PromptDetailShell />
      </div>
    </DashboardShell>
  )
}
