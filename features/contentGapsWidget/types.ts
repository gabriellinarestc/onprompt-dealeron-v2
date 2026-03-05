export type WidgetState = "loading" | "empty" | "error" | "ready"

export interface ContentRecommendation {
  rank: number
  title: string
  description: string
  prompts: number
}

export interface ContentGapsWidgetProps {
  state: WidgetState
  coveragePercent: number
  recommendations: ContentRecommendation[]
  onRetry?: () => void
}
