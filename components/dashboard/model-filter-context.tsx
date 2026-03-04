"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { ModelKey } from "@/lib/models"

const ALL_MODELS: ModelKey[] = ["chatgpt", "claude", "gemini", "perplexity", "copilot"]

interface ModelFilterContextValue {
  activeModels: Set<ModelKey>
  toggleModel: (key: ModelKey) => void
  isModelActive: (key: ModelKey) => boolean
  allModels: ModelKey[]
}

const ModelFilterContext = createContext<ModelFilterContextValue | null>(null)

export function ModelFilterProvider({ children }: { children: ReactNode }) {
  const [activeModels, setActiveModels] = useState<Set<ModelKey>>(new Set(ALL_MODELS))

  const toggleModel = useCallback((key: ModelKey) => {
    setActiveModels((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size > 1) next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const isModelActive = useCallback(
    (key: ModelKey) => activeModels.has(key),
    [activeModels]
  )

  return (
    <ModelFilterContext.Provider value={{ activeModels, toggleModel, isModelActive, allModels: ALL_MODELS }}>
      {children}
    </ModelFilterContext.Provider>
  )
}

export function useModelFilter() {
  const ctx = useContext(ModelFilterContext)
  if (!ctx) throw new Error("useModelFilter must be used within ModelFilterProvider")
  return ctx
}
