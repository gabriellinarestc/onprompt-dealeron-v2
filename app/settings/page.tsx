import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SettingsShell } from "@/features/settings/SettingsShell"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <SettingsShell />
      </div>
    </DashboardShell>
  )
}
