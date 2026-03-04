import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { MessageSquareText } from "lucide-react"

export default function PromptsPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6 h-full">
            <Empty className="h-full border border-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquareText className="size-5" />
                </EmptyMedia>
                <EmptyTitle>Prompts</EmptyTitle>
                <EmptyDescription>
                  Work in progress. This page will display all tracked prompts and their performance metrics.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </main>
      </div>
    </div>
  )
}
