export type WidgetState = "loading" | "empty" | "error" | "ready"

export interface PromptItem {
  prompt: string
  sentiment: number
  visibility: string
  brands: string[]
}

export interface TopPromptsProps {
  state: WidgetState
  data: PromptItem[]
  brandNames: Record<string, string>
  onRetry?: () => void
}
