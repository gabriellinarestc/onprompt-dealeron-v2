import type { CrawlerLogsData } from "./types"

export const mockRealistic: CrawlerLogsData = {
  items: [
    { id: "1", url: "https://www.dealeron.com/inventory" },
    { id: "2", url: "https://www.dealeron.com/specials" },
  ],
}

export const mockEmpty: CrawlerLogsData = {
  items: [],
}

export const mockError = {
  title: "Failed to load crawler logs",
  message: "We couldn't retrieve your crawler log data. Please check your connection and try again.",
  code: "ERR_CRAWLER_LOGS_FETCH",
}
