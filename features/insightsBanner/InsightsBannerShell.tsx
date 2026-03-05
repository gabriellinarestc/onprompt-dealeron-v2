"use client"

import { useState, useEffect } from "react"
import { InsightsBannerView } from "./InsightsBannerView"
import type { WidgetState } from "./types"

export function InsightsBannerShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const [visible, setVisible] = useState(true)
  const [state, setState] = useState<WidgetState>(initialState)

  useEffect(() => {
    setState(initialState)
  }, [initialState])

  if (!visible) return null

  return (
    <InsightsBannerView
      state={state}
      onDismiss={() => setVisible(false)}
      onRetry={() => setState("ready")}
    />
  )
}
