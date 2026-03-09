export type ContentGapsEvents = {
  onSearch?: (query: string) => void
  onExport?: () => void
  onRowClick?: (id: number) => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onRetry?: () => void
}
