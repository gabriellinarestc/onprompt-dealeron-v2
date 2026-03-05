import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import type { VisitorModelItem, CrawlerStatItem } from "./types"

export const mockVisitorModels: VisitorModelItem[] = [
  { key: "chatgpt", visitors: 1243, change: "+38%" },
  { key: "claude", visitors: 587, change: "+24%" },
  { key: "copilot", visitors: 142, change: "+15%" },
  { key: "gemini", visitors: 418, change: "+47%" },
  { key: "aioverview", visitors: 356, change: "+31%" },
  { key: "perplexity", visitors: 209, change: "+22%" },
]

export const mockCrawlerStats: CrawlerStatItem[] = [
  {
    value: 847,
    total: 1024,
    label: "Indexed",
    sub: "pages indexed",
    icon: CheckCircle2,
    status: "ok",
  },
  {
    value: 128,
    total: null,
    label: "Blocked",
    sub: "need attention",
    icon: AlertTriangle,
    status: "warn",
  },
  {
    value: 49,
    total: null,
    label: "Pending",
    sub: "awaiting index",
    icon: Clock,
    status: "info",
  },
]
