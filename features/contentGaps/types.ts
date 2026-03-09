export type ContentGapItem = {
  id: number
  prompt: string
  coveragePercent: number
  citations: number
  queries: number
  changePercent: number
  lastAnalyzed: string
}

export type CoverageStats = {
  coveragePercent: number
  changePercent: number
  promptsCovered: number
  totalPrompts: number
  fullCoverage: number
  partialCoverage: number
  noCoverage: number
}

export type ContentRecommendation = {
  rank: number
  title: string
  description: string
  prompts: number
}

export type ContentGapsData = {
  items: ContentGapItem[]
  stats: CoverageStats
  recommendations: ContentRecommendation[]
}

export type PageInfo = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
