export type PromptsEvents = {
  onSearch?: (query: string) => void
  onCreate?: () => void
  onExport?: () => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onRowClick?: (id: number) => void
  onRetry?: () => void
}
