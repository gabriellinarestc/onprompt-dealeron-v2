export type PromptItem = {
  id: number
  prompt: string
  visibilityScore: number | null
  sentiment: number | null
  volume: number | null
  difficulty: number | null
  brands: string[]
  isAnalyzing: boolean
}

export type PromptsData = {
  items: PromptItem[]
}

export type PageInfo = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type BrandNames = Record<string, string>
