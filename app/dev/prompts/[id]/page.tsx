"use client"

import { useState } from "react"
import { PromptDetailView } from "@/features/promptDetail/PromptDetailView"
import { mockRealistic, mockEmpty, mockError, mockResponseDetails } from "@/features/promptDetail/mocks"
import { Button } from "@/components/ui/button"
import type { PromptDetailPageInfo, ResponseDetail } from "@/features/promptDetail/types"

type ViewState = "loading" | "empty" | "error" | "ready"

const states: { label: string; value: ViewState }[] = [
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "Error", value: "error" },
  { label: "Ready", value: "ready" },
]

export default function PromptDetailDevPage() {
  const [activeState, setActiveState] = useState<ViewState>("ready")
  const [page, setPage] = useState(1)
  const [responseDetail, setResponseDetail] = useState<ResponseDetail | null>(null)
  const [responseDetailOpen, setResponseDetailOpen] = useState(false)
  const pageSize = 4

  const data = activeState === "ready" ? mockRealistic : activeState === "empty" ? mockEmpty : undefined

  const pageInfo: PromptDetailPageInfo | undefined = data
    ? {
        page,
        pageSize,
        totalItems: data.totalResponses,
        totalPages: Math.ceil(data.totalResponses / pageSize),
      }
    : undefined

  const paginatedData = data
    ? {
        ...data,
        responseSnippets: data.responseSnippets.slice((page - 1) * pageSize, page * pageSize),
      }
    : undefined

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dev Preview
            </p>
            <h1 className="text-sm font-bold text-foreground">Prompt Detail</h1>
          </div>
          <div className="flex items-center gap-1">
            {states.map((s) => (
              <Button
                key={s.value}
                variant={activeState === s.value ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setActiveState(s.value)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl p-6">
        <PromptDetailView
          state={activeState}
          data={paginatedData}
          pageInfo={pageInfo}
          error={activeState === "error" ? mockError : undefined}
          responseDetail={responseDetail}
          responseDetailOpen={responseDetailOpen}
          onResponseDetailOpenChange={setResponseDetailOpen}
          onBack={() => console.log("[Dev] onBack")}
          onPageChange={(p) => {
            console.log("[Dev] onPageChange", p)
            setPage(p)
          }}
          onRetry={() => console.log("[Dev] onRetry")}
          onViewResponseDetail={(id) => {
            console.log("[Dev] onViewResponseDetail", id)
            setResponseDetail(mockResponseDetails[id] ?? null)
            setResponseDetailOpen(true)
          }}
          onViewCitation={(url) => {
            console.log("[Dev] onViewCitation", url)
            window.open(`https://${url}`, "_blank", "noopener,noreferrer")
          }}
        />
      </div>
    </div>
  )
}
