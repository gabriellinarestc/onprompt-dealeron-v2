import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BrandsShell } from "@/features/brands/BrandsShell"

export default function BrandsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <BrandsShell />
      </div>
    </DashboardShell>
  )
}
