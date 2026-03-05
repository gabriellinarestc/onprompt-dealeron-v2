export type DashboardEvents = {
  onPeriodChange?: (period: string) => void
  onModelFilterChange?: (models: string[]) => void
  onViewContentGaps?: () => void
  onViewPrompts?: () => void
}
