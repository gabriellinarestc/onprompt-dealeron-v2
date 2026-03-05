export type WidgetState = "loading" | "empty" | "error" | "ready"

export interface TopPageItem {
  page: string
  visitors: number
  crawls: string
}

export interface TopModelItem {
  model: string
  visitors: number
  crawls: string
}

export interface TopPagesModelsProps {
  state: WidgetState
  pages: TopPageItem[]
  models: TopModelItem[]
  onRetry?: () => void
}
