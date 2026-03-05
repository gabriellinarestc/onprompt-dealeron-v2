"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { AlertCircle } from "lucide-react"

export default function ContentGapsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6 h-full">
        <Empty className="h-full border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Content Gaps</EmptyTitle>
            <EmptyDescription>
              Work in progress. This page will show content coverage analysis and recommendations.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </DashboardShell>
  )
}
