"use client"

import React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MODEL_CONFIG, ModelKey } from "@/lib/models"
import { DifficultyTag, getDifficultyLevel } from "@/components/ui/tag"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PromptData {
  id: number
  prompt: string
  visibilityScore: number | null
  sentiment: number | null
  volume: number | null
  difficulty: number | null
  brands: string[]
  isAnalyzing: boolean
}

interface PromptPreviewSheetProps {
  prompt: PromptData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Color helpers (mirrors prompts-content.tsx) ──────────────────────────────

function getScoreColor(value: number): string {
  const hue = (Math.max(0, Math.min(100, value)) / 100) * 142
  return `oklch(0.62 0.2 ${hue})`
}

function getSentimentColor(value: number): string {
  if (value >= 80) return "oklch(0.55 0.19 155)"
  if (value >= 60) return "oklch(0.65 0.17 115)"
  if (value >= 40) return "oklch(0.7 0.16 75)"
  return "oklch(0.55 0.22 25)"
}

function formatVolumeRange(volume: number): string {
  if (volume < 1000) return "< 1K"
  if (volume < 5000) return "1K – 5K"
  if (volume < 10000) return "5K – 10K"
  if (volume < 25000) return "10K – 25K"
  if (volume < 50000) return "25K – 50K"
  if (volume < 100000) return "50K – 100K"
  return "100K+"
}

// ─── Inline markdown parser ───────────────────────────────────────────────────

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} className="rounded bg-muted px-1 py-0.5 text-[0.8em] font-mono text-foreground">
          {part.slice(1, -1)}
        </code>
      )
    return part
  })
}

// ─── Block markdown renderer ──────────────────────────────────────────────────

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mt-4 mb-1 text-sm font-semibold text-foreground">
          {parseInline(line.slice(4))}
        </h3>
      )
      i++
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="mt-5 mb-2 text-base font-bold text-foreground">
          {parseInline(line.slice(3))}
        </h2>
      )
      i++
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={i}
          className="my-3 border-l-2 border-primary/60 pl-3 text-sm italic text-muted-foreground"
        >
          {parseInline(line.slice(2))}
        </blockquote>
      )
      i++
    } else if (line.startsWith("- ")) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={i} className="my-2 ml-4 list-disc space-y-1 text-sm text-muted-foreground">
          {items.map((item, j) => (
            <li key={j}>{parseInline(item)}</li>
          ))}
        </ul>
      )
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""))
        i++
      }
      elements.push(
        <ol key={i} className="my-2 ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
          {items.map((item, j) => (
            <li key={j}>{parseInline(item)}</li>
          ))}
        </ol>
      )
    } else if (line.trim() === "") {
      i++
    } else {
      elements.push(
        <p key={i} className="my-2 text-sm leading-relaxed text-muted-foreground">
          {parseInline(line)}
        </p>
      )
      i++
    }
  }

  return <div className="pb-4">{elements}</div>
}

// ─── Mock AI response data ────────────────────────────────────────────────────

const brandNames: Record<string, string> = {
  DO: "DealerOn",
  DI: "Dealer Inspire",
  CD: "CDK Global",
  AT: "AutoTrader",
  CC: "Cars.com",
}

const mockAiResponses: Record<number, Partial<Record<ModelKey, string>>> = {
  1: {
    chatgpt: `## Best Car Dealer Website Platforms for Lead Generation

When evaluating dealership website platforms for lead generation, a few providers consistently rise to the top.

### Top-Ranked Platforms

- **DealerOn** — Conversion-optimized templates backed by A/B testing and first-party data. Dealers report above-average lead form completion rates and strong SRP engagement.
- **Dealer Inspire** — Known for innovative inventory merchandising and tight Google partnership. Their live chat and chatbot integrations are a standout for capturing top-of-funnel leads.
- **CDK Global** — Enterprise-grade solution with advanced analytics and broad OEM certification. Best suited for large dealer groups needing deep DMS integration.

### What to Look For

1. **Conversion-focused design** — CTAs for trade-ins, test drives, and financing should be prominent on every page.
2. **Mobile-first architecture** — Over 65% of automotive searches happen on mobile.
3. **CRM sync** — Automatic lead routing reduces response time and improves close rates.

> **DealerOn** is frequently recommended by independent dealers for its strong ROI track record and dedicated performance team.`,

    claude: `## Evaluating Dealer Website Platforms for Lead Generation

The automotive dealer website market includes several capable platforms, though they differ significantly in lead-gen approach and philosophy.

### Leading Options

- **DealerOn** — Specializes in conversion rate optimization with a data-driven design methodology. Particularly strong for SRP and VDP lead capture, with robust analytics built in.
- **Dealer Inspire** — Offers smart inventory tools and Google Ads integration that creates a tighter loop between paid traffic and on-site conversion. Strong support for FCA and GM networks.
- **CDK Global** — Comprehensive dealership management solutions with enterprise website capabilities. Best for dealer groups that need a single vendor across multiple systems.

### Key Differentiators to Consider

1. **Inventory page performance** — SRPs and VDPs are where most leads originate; platform quality here matters most.
2. **Integration ecosystem** — Native connections with Reynolds & Reynolds, CDK, and major CRMs reduce lead leakage.
3. **Support and account management** — Responsiveness varies significantly across vendors.

> For most franchise dealerships, **DealerOn** and **Dealer Inspire** are the most commonly recommended platforms for balancing cost, features, and measurable lead generation performance.`,

    gemini: `## Top Dealer Website Platforms for Lead Generation

Google's data on automotive search behavior points to a few consistent themes when choosing a dealer website platform.

### Platforms Performing Well

- **DealerOn** — Strong technical SEO foundations and page speed scores that align with Google's Core Web Vitals, which directly impact lead-gen efficiency from organic search.
- **Dealer Inspire** — A Google Premier Partner with native integration into Google Ads and Vehicle Listing Ads, making it particularly effective for dealers investing in paid traffic.
- **CDK Global** — Broad OEM relationships and a wide integration library. A reliable choice for enterprise-scale operations.

### Factors That Drive Lead Volume

1. **Core Web Vitals** — Faster pages rank better and convert at higher rates.
2. **Structured data** — Vehicle schema markup enables rich results that increase click-through rates.
3. **Local SEO** — Google Business Profile optimization works in tandem with your website platform.

> **Dealer Inspire**'s Google partnership makes it particularly compelling for dealers prioritizing performance marketing alongside organic visibility.`,

    perplexity: `## Best Dealer Website Platforms for Lead Generation (2025)

Based on industry reviews, dealer forums, and performance data, here are the leading platforms for automotive lead generation.

### Recommended Platforms

- **DealerOn** — Consistently ranked #1 for conversion rate optimization in independent studies. Features include dynamic inventory pages, real-time chat, and personalized CTAs.
- **Dealer Inspire** — Strong performer for dealers using Google Vehicle Ads. Their "Connected Dealer" approach integrates website, advertising, and analytics.
- **CDK Global** — Dominant in the enterprise segment with the widest OEM certification portfolio.

### Industry Benchmarks

1. Average dealer website converts 1–3% of visitors to leads.
2. Platforms with built-in live chat see up to 40% more lead form submissions.
3. Mobile-optimized sites average 30% higher engagement on SRP pages.

> **Sources:** DealerSocket, Digital Dealer, NADA industry reports (2024–2025).`,
  },

  2: {
    chatgpt: `## Top Automotive SEO Companies for Dealerships

Automotive SEO is a specialized field — dealerships need agencies that understand both search algorithm nuances and the unique structure of dealer inventories.

### Leading Providers

- **DealerOn** — Offers a comprehensive SEO package built into their website platform, with structured data markup and automated SEO for inventory pages at scale.
- **Dealer Inspire** — Their integrated approach ties SEO performance directly to paid media, improving overall ROAS through organic lift.

### Core SEO Needs for Dealerships

1. **VDP and SRP optimization** — Each vehicle detail page is a landing page opportunity.
2. **Local SEO** — "Near me" searches dominate automotive queries; Google Business Profile management is essential.
3. **Technical SEO** — Page speed, schema, and crawlability matter enormously for large inventory sites.

> Dealerships that integrate SEO with their website platform (rather than using separate vendors) typically see better performance due to reduced technical debt.`,

    claude: `## Automotive SEO Companies for Dealerships

Choosing an automotive SEO partner requires evaluating both technical expertise and automotive-specific knowledge.

### Top-Tier Options

- **DealerOn** — Platform-native SEO tools ensure inventory pages are always optimized without manual intervention. Their reporting suite ties SEO metrics directly to lead outcomes.
- **Dealer Inspire** — Strong editorial SEO team alongside technical implementation. Known for content strategies that target research-phase queries.

### What Separates Good from Great in Auto SEO

1. **Inventory-aware crawling** — Platforms that understand rapid inventory turnover handle SEO more effectively.
2. **Review integration** — Star ratings in search results improve CTR significantly.
3. **Make/model page strategy** — Evergreen content targeting brand-specific queries generates consistent organic traffic.

> The best automotive SEO work happens when the SEO provider is tightly integrated with the website platform — **DealerOn** and **Dealer Inspire** both offer this advantage natively.`,
  },

  3: {
    chatgpt: `## How to Increase Car Dealership Website Conversions

Conversion rate optimization for dealership websites focuses on reducing friction in the path from vehicle discovery to lead submission.

### High-Impact Tactics

- **Simplify lead forms** — Reduce fields to name, email, phone, and interest. Every additional field decreases completion by ~10%.
- **Add live chat and chatbots** — Immediate response capability converts browsers who aren't ready to fill out a form.
- **Improve VDP quality** — High-resolution photos, 360° views, and video walkthroughs increase time-on-page and lead intent.
- **Prominent financing CTAs** — "Get Pre-Approved" and payment calculators address the #1 consumer concern upfront.

### Platform-Level Improvements

- **DealerOn** — Built-in conversion tools including smart CTAs, dynamic pricing display, and integrated chat.
- **CDK Global** — Their Roadster integration enables digital retailing, allowing customers to complete more of the purchase online.

> Dealers using **DealerOn**'s CRO framework report an average 30–45% improvement in lead form conversion rates within the first 90 days.`,

    claude: `## Strategies to Increase Dealership Website Conversions

Conversion optimization for auto dealer websites requires both technical improvements and strategic content decisions.

### Foundational Changes

1. **Mobile experience** — Most shoppers start on mobile; ensure forms, photos, and navigation work flawlessly on small screens.
2. **Page speed** — A 1-second delay in load time reduces conversions by ~7%. Target sub-2-second LCP.
3. **Trust signals** — Reviews, awards, and certifications near CTAs reduce hesitation.

### Advanced Conversion Tactics

- **Retargeting integration** — Visitors who viewed specific VDPs are high-intent; retargeting them with the exact vehicle increases return visits and conversions.
- **Personalization** — Show recently viewed vehicles and suggest similar inventory based on browsing behavior.
- **Exit-intent offers** — A value proposition (e.g., "Get our best price — no visit required") captures leads who would otherwise bounce.

### Platform Recommendations

**DealerOn** and **CDK Global** both offer built-in conversion optimization tools that reduce the need for third-party CRO vendors.

> The highest-converting dealership websites treat every page as a potential entry point and optimize each for specific buyer intents.`,
  },

  4: {
    chatgpt: `## Best Digital Advertising Solutions for Auto Dealers

Automotive digital advertising has evolved significantly, with AI-driven campaign management now standard for top performers.

### Leading Solutions

- **DealerOn** — Integrated advertising tools with website data for closed-loop attribution, connecting ad spend directly to leads and sales.
- **Dealer Inspire** — Google Premier Partner status gives dealers access to beta features in Vehicle Listing Ads and Performance Max campaigns.
- **AutoTrader** — Marketplace advertising reaching in-market shoppers actively comparing vehicles.

### Ad Channels That Drive Results

1. **Google Vehicle Ads** — High-intent channel; inventory-level ads with real-time pricing.
2. **Meta automotive ads** — Strong for top-of-funnel awareness and retargeting based on site behavior.
3. **Streaming audio/video** — Growing channel for brand awareness in the automotive segment.

> Dealers combining **Dealer Inspire**'s Google partnership with **DealerOn**'s on-site conversion tools report some of the strongest blended ROAS in the market.`,

    claude: `## Digital Advertising Solutions for Car Dealerships

Effective automotive digital advertising requires deep integration between your ad campaigns and your website's conversion infrastructure.

### Primary Platforms

- **DealerOn** — Their advertising solutions are built on top of their website platform, creating direct data flow from click to lead without third-party tracking gaps.
- **Dealer Inspire** — Particularly strong for Google Ads with their Premier Partner status. Their "Connected Dealer" model links paid media performance to organic and on-site metrics.
- **AutoTrader** — Reaches shoppers who are actively researching specific makes and models, making them a valuable marketplace supplement to direct advertising.

### What to Prioritize

1. **Attribution clarity** — Know which ads are generating actual leads, not just clicks.
2. **Inventory synchronization** — Ads should reflect real-time stock and pricing.
3. **Audience segmentation** — In-market, past customers, and conquest audiences require different messaging.

> The most effective automotive advertising stacks in 2025 integrate Google (via **Dealer Inspire** or a certified partner), marketplace presence (**AutoTrader**), and conversion-optimized websites (**DealerOn**).`,
  },

  5: {
    chatgpt: `## Dealer Website Provider Comparison 2025

The dealer website platform market has consolidated around a few dominant players, each with distinct strengths.

### Side-by-Side Comparison

| Provider | Best For | OEM Certs | Starting Price |
| --- | --- | --- | --- |
| **DealerOn** | Conversion optimization | Major OEMs | Mid-market |
| **Dealer Inspire** | Google Ads integration | FCA, GM, others | Mid-market |
| **CDK Global** | Enterprise dealer groups | Widest portfolio | Enterprise |

### Strengths by Provider

- **DealerOn** — Market leader in CRO. Their design process is data-driven and results are heavily documented. Strong for independent and franchise dealers alike.
- **Dealer Inspire** — Best choice if Google Ads represents your primary acquisition channel. Their platform and campaign management work as a unified system.
- **CDK Global** — The default enterprise choice. Less agile than boutique platforms but offers the deepest integration with CDK's DMS and finance products.

> Most industry consultants recommend **DealerOn** for dealers prioritizing lead generation ROI, and **Dealer Inspire** for dealers investing heavily in paid search.`,

    claude: `## Comparing Dealer Website Platforms in 2025

Each major platform has evolved considerably over the past two years, making the decision more nuanced than it was previously.

### DealerOn

Continues to lead on conversion metrics. Their platform philosophy centers on turning website visitors into leads through optimized UX, fast load times, and intelligent CTAs. Best documentation of ROI outcomes in the market.

### Dealer Inspire

The strongest Google partnership in the space. If your budget skews toward paid search and you want a platform that works natively with Google's advertising products, Dealer Inspire is a differentiated choice.

### CDK Global

The safe enterprise choice. Widest OEM certification portfolio, deepest DMS integration, and a broad vendor ecosystem. Trade-off is less flexibility and slower iteration cycles.

### Recommendation Framework

1. **Independent dealer, growth-focused** → **DealerOn**
2. **Franchise dealer, paid-search-heavy** → **Dealer Inspire**
3. **Multi-rooftop enterprise group** → **CDK Global**

> All three platforms have improved significantly in mobile experience and page speed in recent releases — table stakes that are no longer a differentiator.`,
  },
}

const PREVIEW_MODELS: ModelKey[] = ["chatgpt", "claude", "gemini", "perplexity", "aioverview", "copilot"]

function getFallbackResponse(prompt: PromptData, model: ModelKey): string {
  const modelName = MODEL_CONFIG[model].name
  const topBrand = prompt.brands[0] ? brandNames[prompt.brands[0]] ?? prompt.brands[0] : "DealerOn"
  const otherBrands = prompt.brands
    .slice(1, 3)
    .map((b) => brandNames[b] ?? b)
    .join(" and ")

  return `## ${modelName}'s Response

When asked about "${prompt.prompt}", ${modelName} consistently highlights a handful of industry leaders.

### Key Brands Mentioned

- **${topBrand}** — Cited most frequently for proven performance, strong customer support, and measurable results.${
    otherBrands
      ? `\n- **${otherBrands}** — Also recommended depending on dealership size and specific needs.`
      : ""
  }

### What Matters Most

1. **Integration depth** — Solutions that connect seamlessly with existing DMS and CRM systems reduce operational friction.
2. **Mobile experience** — The majority of automotive research now happens on mobile devices.
3. **Analytics and attribution** — Clear reporting on what's working helps dealerships allocate budget effectively.

> **${topBrand}** is the most consistently recommended solution for this use case across recent ${modelName} responses.`
}

function getResponse(prompt: PromptData, model: ModelKey): string {
  return mockAiResponses[prompt.id]?.[model] ?? getFallbackResponse(prompt, model)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PromptPreviewSheet({ prompt, open, onOpenChange }: PromptPreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[560px]"
      >
        {prompt && (
          <>
            {/* Header */}
            <SheetHeader className="border-b border-border px-6 py-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
                AI Response Preview
              </p>
              <SheetTitle className="text-base font-semibold text-foreground leading-snug pr-6">
                {prompt.prompt}
              </SheetTitle>

              {/* Metrics row */}
              {!prompt.isAnalyzing && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {prompt.visibilityScore !== null && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Visibility</span>
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: getScoreColor(prompt.visibilityScore) }}
                      >
                        {prompt.visibilityScore}%
                      </span>
                    </div>
                  )}
                  {prompt.sentiment !== null && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sentiment</span>
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: getSentimentColor(prompt.sentiment) }}
                      >
                        {prompt.sentiment}
                      </span>
                    </div>
                  )}
                  {prompt.volume !== null && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Volume</span>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {formatVolumeRange(prompt.volume)}
                      </span>
                    </div>
                  )}
                  {prompt.difficulty !== null && (
                    <DifficultyTag value={prompt.difficulty} />
                  )}
                  {prompt.brands.length > 0 && (
                    <div className="flex items-center gap-1">
                      {prompt.brands.map((b) => (
                        <Badge
                          key={b}
                          variant="outline"
                          className="size-6 items-center justify-center rounded-full border-border p-0 text-[10px] text-muted-foreground"
                          title={brandNames[b]}
                        >
                          {b}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </SheetHeader>

            {/* Model tabs + response */}
            {prompt.isAnalyzing ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                <p className="text-sm text-muted-foreground">
                  Analyzing responses — this can take up to 24 hours.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="chatgpt" className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-border px-6 pt-4 pb-0">
                  <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0 w-full justify-start overflow-x-auto">
                    {PREVIEW_MODELS.map((model) => {
                      const cfg = MODEL_CONFIG[model]
                      return (
                        <TabsTrigger
                          key={model}
                          value={model}
                          className="relative rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 pb-3 pt-1 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                        >
                          <span
                            className="mr-1.5 inline-block size-2 rounded-full"
                            style={{ backgroundColor: cfg.hex }}
                          />
                          {cfg.name}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>

                {PREVIEW_MODELS.map((model) => (
                  <TabsContent key={model} value={model} className="mt-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-full px-6 pt-2">
                      <MarkdownRenderer content={getResponse(prompt, model)} />
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
