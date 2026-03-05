"use client"

import { useState } from "react"
import { TopPromptsView } from "./TopPromptsView"
import { mockPromptsData, mockBrandNames } from "./mocks"
import type { WidgetState } from "./types"

export function TopPromptsShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const [state, setState] = useState<WidgetState>(initialState)

  return (
    <TopPromptsView
      state={state}
      data={mockPromptsData}
      brandNames={mockBrandNames}
      onRetry={() => setState("ready")}
    />
  )
}
