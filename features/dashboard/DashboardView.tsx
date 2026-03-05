"use client"

import { InsightsBannerShell } from "@/features/insightsBanner/InsightsBannerShell"
import { MentionsByModelShell } from "@/features/mentionsByModel/MentionsByModelShell"
import { BrandComparisonShell } from "@/features/brandComparison/BrandComparisonShell"
import { BrandSentimentShell } from "@/features/brandSentiment/BrandSentimentShell"
import { TopPromptsShell } from "@/features/topPrompts/TopPromptsShell"
import { ContentGapsWidgetShell } from "@/features/contentGapsWidget/ContentGapsWidgetShell"
import { VisitorAnalyticsShell } from "@/features/visitorAnalytics/VisitorAnalyticsShell"
import { TopPagesModelsShell } from "@/features/topPagesModels/TopPagesModelsShell"
import { SectionHeader } from "@/components/patterns/section-header"
import type { WidgetState } from "./types"

export type DashboardViewProps = {
  widgetState?: WidgetState
}

export function DashboardView({ widgetState = "ready" }: DashboardViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <InsightsBannerShell initialState={widgetState} />

      <SectionHeader
        title="Brand Visibility"
        tooltip="How visible your brand is across AI models like ChatGPT, Claude, and Gemini when users ask relevant questions."
      />
      <MentionsByModelShell initialState={widgetState} />
      <BrandComparisonShell initialState={widgetState} />

      <SectionHeader
        title="Brand Sentiment"
        tooltip="How positively or negatively AI models describe your brand when it appears in their responses."
      />
      <BrandSentimentShell initialState={widgetState} />

      <SectionHeader
        title="Prompts & Content Coverage"
        tooltip="The specific user questions where your brand appears and topics where you have gaps in AI coverage."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TopPromptsShell initialState={widgetState} />
        </div>
        <div className="lg:col-span-2">
          <ContentGapsWidgetShell initialState={widgetState} />
        </div>
      </div>

      <SectionHeader
        title="Visitor Analytics & Crawler Logs"
        tooltip="Real traffic and crawl activity from AI models on your website. Understand which models drive visitors and how they index your content."
      />
      <VisitorAnalyticsShell initialState={widgetState} />
      <TopPagesModelsShell initialState={widgetState} />
    </div>
  )
}
