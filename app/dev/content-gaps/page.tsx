"use client"

import { useState } from "react"
import { ContentGapsView } from "@/features/contentGaps/ContentGapsView"
import { mockRealistic, mockEmpty, mockStress, mockError } from "@/features/contentGaps/mocks"
import { Button } from "@/components/ui/button"

type ViewState = "loading" | "empty" | "error" | "ready" | "no-results" | "stress"

const states: { label: string; value: ViewState }[] = [
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "No Results", value: "no-results" },
  { label: "Error", value: "error" },
  { label: "Ready", value: "ready" },
  { label: "Stress", value: "stress" },
]

export default function ContentGapsDevPage() {
  const [activeState, setActiveState] = useState<ViewState>("ready")

  const resolvedState = activeState === "stress" ? "ready" : activeState
  const data =
    activeState === "stress"
      ? mockStress
      : activeState === "ready"
      ? mockRealistic
      : activeState === "empty" || activeState === "no-results"
      ? mockEmpty
      : undefined

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dev Preview
            </p>
            <h1 className="text-sm font-bold text-foreground">Content Gaps</h1>
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
        <ContentGapsView
          state={resolvedState as "loading" | "empty" | "error" | "ready" | "no-results"}
          data={data}
          error={activeState === "error" ? mockError : undefined}
          searchQuery={activeState === "no-results" ? "nonexistent query xyz" : ""}
          pageInfo={
            data
              ? {
                  page: 1,
                  pageSize: 50,
                  totalItems: data.items.length,
                  totalPages: Math.ceil(data.items.length / 50),
                }
              : undefined
          }
          onSearch={(q) => console.log("onSearch", q)}
          onExport={() => console.log("onExport")}
          onPageChange={(p) => console.log("onPageChange", p)}
          onPageSizeChange={(s) => console.log("onPageSizeChange", s)}
          onRowClick={(id) => console.log("onRowClick", id)}
          onRetry={() => console.log("onRetry")}
        />
      </div>
    </div>
  )
}
