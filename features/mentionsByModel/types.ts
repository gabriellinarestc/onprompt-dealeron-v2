import type { ModelKey } from "@/lib/models"

export type WidgetState = "loading" | "empty" | "error" | "ready"

export interface ScoreCardItem {
  value: number
  label: string
}

export interface ModelMentionItem {
  key: ModelKey
  mentions: number
  change: string
}

export interface MentionsByModelProps {
  state: WidgetState
  scores: ScoreCardItem[]
  models: ModelMentionItem[]
  comparePrior: boolean
  onRetry?: () => void
}
