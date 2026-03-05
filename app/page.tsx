"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InsightsBanner } from "@/components/dashboard/insights-banner"
import { BrandVisibilityCards } from "@/components/dashboard/brand-visibility-cards"
import { BrandVisibilityChart } from "@/components/dashboard/brand-visibility-chart"
import { BrandSentiment } from "@/components/dashboard/brand-sentiment"
import { TopPrompts } from "@/components/dashboard/top-prompts"
import { ContentGaps } from "@/components/dashboard/content-gaps"
import { VisitorAnalytics } from "@/components/dashboard/visitor-analytics"
import { TopPagesModels } from "@/components/dashboard/top-pages-models"
import { SectionHeader } from "@/components/dashboard/section-header"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex flex-col gap-6">
          <InsightsBanner />

              {/* Brand Visibility Section */}
              <SectionHeader title="Brand Visibility" tooltip="How visible your brand is across AI models like ChatGPT, Claude, and Gemini when users ask relevant questions." />
              <BrandVisibilityCards />
              <BrandVisibilityChart />

              {/* Brand Sentiment Section */}
              <SectionHeader title="Brand Sentiment" tooltip="How positively or negatively AI models describe your brand when it appears in their responses." />
              <BrandSentiment />

              {/* Prompts & Content Coverage Section */}
              <SectionHeader title="Prompts & Content Coverage" tooltip="The specific user questions where your brand appears and topics where you have gaps in AI coverage." />
              <div className="grid gap-4 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <TopPrompts />
                </div>
                <div className="lg:col-span-2">
                  <ContentGaps />
                </div>
              </div>

              {/* Visitor Analytics & Crawler Logs Section */}
              <SectionHeader title="Visitor Analytics & Crawler Logs" tooltip="Real traffic and crawl activity from AI models on your website. Understand which models drive visitors and how they index your content." />
              <VisitorAnalytics />
              <TopPagesModels />
        </div>
      </div>
    </DashboardShell>
  )
}
