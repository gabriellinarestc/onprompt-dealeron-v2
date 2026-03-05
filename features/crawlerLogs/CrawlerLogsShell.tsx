"use client"

import { CrawlerLogsView } from "./CrawlerLogsView"
import { mockRealistic } from "./mocks"

export function CrawlerLogsShell() {
  return (
    <CrawlerLogsView
      state="ready"
      data={mockRealistic}
      onRetry={() => {}}
    />
  )
}
