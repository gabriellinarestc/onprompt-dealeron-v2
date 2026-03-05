export type WidgetState = "loading" | "empty" | "error" | "ready"

export interface SentimentDataPoint {
  date: string
  score: number
}

export interface BrandSentimentProps {
  state: WidgetState
  data: SentimentDataPoint[]
  currentScore: number
  comparePrior: boolean
  onRetry?: () => void
}
