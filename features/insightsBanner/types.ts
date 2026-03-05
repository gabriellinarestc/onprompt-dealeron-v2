export type WidgetState = "loading" | "empty" | "error" | "ready"

export interface InsightsBannerProps {
  state: WidgetState
  onDismiss?: () => void
  onRetry?: () => void
}
