"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ModelFilterProvider } from "@/components/dashboard/model-filter-context"
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
    <ModelFilterProvider>
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
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
        </main>
      </div>
    </div>
    </ModelFilterProvider>
  )
}
