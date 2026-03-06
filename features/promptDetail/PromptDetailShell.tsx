"use client"

import { useState } from "react"
import { PromptDetailView } from "./PromptDetailView"
import { mockRealistic, mockResponseDetails } from "./mocks"
import type { PromptDetailPageInfo } from "./types"
import type { ResponseDetail } from "./types"

export function PromptDetailShell() {
  const [page, setPage] = useState(1)
  const [responseDetail, setResponseDetail] = useState<ResponseDetail | null>(null)
  const [responseDetailOpen, setResponseDetailOpen] = useState(false)

  const pageSize = 4
  const totalItems = mockRealistic.totalResponses

  const pageInfo: PromptDetailPageInfo = {
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  }

  const paginatedSnippets = mockRealistic.responseSnippets.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  return (
    <PromptDetailView
      state="ready"
      data={{ ...mockRealistic, responseSnippets: paginatedSnippets }}
      pageInfo={pageInfo}
      responseDetail={responseDetail}
      responseDetailOpen={responseDetailOpen}
      onResponseDetailOpenChange={setResponseDetailOpen}
      onBack={() => {
        if (typeof window !== "undefined") {
          window.history.back()
        }
      }}
      onPageChange={(p) => {
        console.log("[PromptDetailShell] onPageChange", p)
        setPage(p)
      }}
      onRetry={() => console.log("[PromptDetailShell] onRetry")}
      onViewResponseDetail={(id) => {
        console.log("[PromptDetailShell] onViewResponseDetail", id)
        const detail = mockResponseDetails[id] ?? null
        setResponseDetail(detail)
        setResponseDetailOpen(true)
      }}
      onViewCitation={(url) => {
        console.log("[PromptDetailShell] onViewCitation", url)
        window.open(`https://${url}`, "_blank", "noopener,noreferrer")
      }}
    />
  )
}
