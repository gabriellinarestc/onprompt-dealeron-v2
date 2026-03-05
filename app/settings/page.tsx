"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6 h-full">
        <Empty className="h-full border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Settings className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Settings</EmptyTitle>
            <EmptyDescription>
              Work in progress. This page will contain account and application settings.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </DashboardShell>
  )
}
