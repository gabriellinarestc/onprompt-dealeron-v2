export type ContentGapItem = {
  id: number
  topic: string
  category: string
  coverageStatus: "not-covered" | "partially-covered" | "covered"
  promptCount: number
  competitorsCovering: number
  totalCompetitors: number
  priority: "high" | "medium" | "low"
  recommendation: string
}

export type CoverageStats = {
  coveragePercent: number
  totalTopics: number
  coveredTopics: number
  partiallyCovered: number
  notCovered: number
}

export type ContentGapsData = {
  items: ContentGapItem[]
  stats: CoverageStats
}

export type PageInfo = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
