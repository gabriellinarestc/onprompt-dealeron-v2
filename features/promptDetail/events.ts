export type PromptDetailEvents = {
  onBack?: () => void
  onPageChange?: (page: number) => void
  onRetry?: () => void
  onViewResponseDetail?: (id: number) => void
  onViewCitation?: (url: string) => void
}
