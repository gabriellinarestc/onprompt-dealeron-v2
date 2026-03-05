import type { ModelKey } from "@/lib/models"

export type WidgetState = "loading" | "empty" | "error" | "ready"

export type BrandType = "main" | "competitor" | "partner"

export interface BrandEntry {
  name: string
  website: string
  type: BrandType
  visibility: number
  chatgpt: number
  claude: number
  copilot: number
  gemini: number
  aioverview: number
  perplexity: number
}

export interface BrandComparisonProps {
  state: WidgetState
  data: BrandEntry[]
  activeModels: Set<ModelKey>
  onRetry?: () => void
}
