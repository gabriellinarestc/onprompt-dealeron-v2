"use client"

import { useState } from "react"
import { useModelFilter } from "@/components/dashboard/model-filter-context"
import { MentionsByModelView } from "./MentionsByModelView"
import { mockScores, mockModelData } from "./mocks"
import type { WidgetState } from "./types"

export function MentionsByModelShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const { isModelActive, comparePrior } = useModelFilter()
  const [state, setState] = useState<WidgetState>(initialState)

  const filteredModels = mockModelData.filter((item) => isModelActive(item.key))

  return (
    <MentionsByModelView
      state={state}
      scores={mockScores}
      models={filteredModels}
      comparePrior={comparePrior}
      onRetry={() => setState("ready")}
    />
  )
}
