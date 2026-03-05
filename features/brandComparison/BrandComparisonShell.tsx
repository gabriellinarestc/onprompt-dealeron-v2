"use client"

import { useState } from "react"
import { useModelFilter } from "@/components/dashboard/model-filter-context"
import { BrandComparisonView } from "./BrandComparisonView"
import { mockChartData } from "./mocks"
import type { WidgetState } from "./types"

export function BrandComparisonShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const { activeModels } = useModelFilter()
  const [state, setState] = useState<WidgetState>(initialState)

  return (
    <BrandComparisonView
      state={state}
      data={mockChartData}
      activeModels={activeModels}
      onRetry={() => setState("ready")}
    />
  )
}
