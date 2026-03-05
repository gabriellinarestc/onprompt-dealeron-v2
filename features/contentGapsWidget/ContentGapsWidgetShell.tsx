"use client"

import { useState } from "react"
import { ContentGapsWidgetView } from "./ContentGapsWidgetView"
import { mockCoveragePercent, mockRecommendations } from "./mocks"
import type { WidgetState } from "./types"

export function ContentGapsWidgetShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const [state, setState] = useState<WidgetState>(initialState)

  return (
    <ContentGapsWidgetView
      state={state}
      coveragePercent={mockCoveragePercent}
      recommendations={mockRecommendations}
      onRetry={() => setState("ready")}
    />
  )
}
