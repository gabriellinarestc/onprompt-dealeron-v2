"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Building2 } from "lucide-react"

export default function BrandsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6 h-full">
        <Empty className="h-full border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Brands</EmptyTitle>
            <EmptyDescription>
              Work in progress. This page will display brand management and tracking settings.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </DashboardShell>
  )
}
