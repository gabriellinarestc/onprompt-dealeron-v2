import type { ModelKey } from "@/lib/models"
import type { LucideIcon } from "lucide-react"

export type WidgetState = "loading" | "empty" | "error" | "ready"

export type CrawlerStatus = "ok" | "warn" | "info"

export interface VisitorModelItem {
  key: ModelKey
  visitors: number
  change: string
}

export interface CrawlerStatItem {
  value: number
  total: number | null
  label: string
  sub: string
  icon: LucideIcon
  status: CrawlerStatus
}

export interface VisitorAnalyticsProps {
  state: WidgetState
  visitorModels: VisitorModelItem[]
  crawlerStats: CrawlerStatItem[]
  comparePrior: boolean
  onRetry?: () => void
}
