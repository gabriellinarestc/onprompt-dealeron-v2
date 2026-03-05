"use client"

import { useState, useEffect } from "react"
import { useModelFilter } from "@/components/dashboard/model-filter-context"
import { resolveModelKey } from "@/lib/models"
import { TopPagesModelsView } from "./TopPagesModelsView"
import { mockTopPages, mockTopModels } from "./mocks"
import type { WidgetState } from "./types"

export function TopPagesModelsShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const { isModelActive } = useModelFilter()
  const [state, setState] = useState<WidgetState>(initialState)

  useEffect(() => {
    setState(initialState)
  }, [initialState])

  const filteredModels = mockTopModels.filter((item) => {
    const key = resolveModelKey(item.model)
    return key ? isModelActive(key) : true
  })

  return (
    <TopPagesModelsView
      state={state}
      pages={mockTopPages}
      models={filteredModels}
      onRetry={() => setState("ready")}
    />
  )
}
