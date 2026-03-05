"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Bug } from "lucide-react"

export default function CrawlerLogsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6 h-full">
        <Empty className="h-full border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bug className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Crawler Logs</EmptyTitle>
            <EmptyDescription>
              Work in progress. This page will show detailed crawler activity and logs.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </DashboardShell>
  )
}
