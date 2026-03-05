import type { TopPageItem, TopModelItem } from "./types"

export const mockTopPages: TopPageItem[] = [
  { page: "/", visitors: 842, crawls: "312.4k" },
  { page: "/dealer-websites/", visitors: 467, crawls: "48.7k" },
  { page: "/seo-solutions/", visitors: 389, crawls: "35.2k" },
  { page: "/digital-advertising/", visitors: 274, crawls: "22.1k" },
  { page: "/case-studies/", visitors: 198, crawls: "18.6k" },
]

export const mockTopModels: TopModelItem[] = [
  { model: "chatgpt.com", visitors: 1243, crawls: "716.4k" },
  { model: "claude.ai", visitors: 587, crawls: "338.5k" },
  { model: "gemini.google.com", visitors: 418, crawls: "124.8k" },
  { model: "google.com/search", visitors: 356, crawls: "245.2k" },
  { model: "perplexity.ai", visitors: 209, crawls: "116.4k" },
  { model: "copilot.microsoft.com", visitors: 142, crawls: "58.9k" },
]
