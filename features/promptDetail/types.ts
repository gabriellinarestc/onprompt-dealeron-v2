import type { ModelKey } from "@/lib/models"

export type VisibilityDataPoint = {
  date: string
  [brand: string]: number | string
}

export type SentimentScore = {
  score: number
  trend: "positive" | "neutral" | "negative"
}

export type VisibilityScore = {
  percent: number
}

export type Citation = {
  id: number
  title: string
  url: string
}

export type ResponseSnippet = {
  id: number
  model: ModelKey
  date: string
  visibilityPercent: number
  sentimentScore: number
  citationCount: number
  brands: string[]
  snippet: string
}

export type ResponseDetailCitation = {
  id: number
  title: string
  description: string
  url: string
}

export type ResponseDetail = ResponseSnippet & {
  userPrompt: string
  fullResponse: string
  citations: ResponseDetailCitation[]
}

export type QueryFanout = {
  id: number
  query: string
  visibilityChange: number
  model: ModelKey
}

export type PromptDetailData = {
  prompt: string
  lastUpdated: string
  visibilityOverTime: VisibilityDataPoint[]
  visibilityBrands: string[]
  sentimentScore: SentimentScore
  visibilityScore: VisibilityScore
  brandsInResponses: string[]
  topCitations: Citation[]
  queryFanouts: QueryFanout[]
  responseSnippets: ResponseSnippet[]
  totalResponses: number
}

export type PromptDetailPageInfo = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
