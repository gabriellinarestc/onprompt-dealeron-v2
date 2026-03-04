"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { PromptsContent } from "@/components/dashboard/prompts-content"

export default function PromptsPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6">
            <PromptsContent />
          </div>
        </main>
      </div>
    </div>
  )
}
