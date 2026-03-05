"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Lightbulb,
  Search,
  Target,
  TrendingDown,
  X,
} from "lucide-react"
import { HelpTooltip } from "./help-tooltip"
import { SectionHeader } from "./section-header"
import { TruncatedText } from "./truncated-text"
import { MODEL_CONFIG, type ModelKey } from "@/lib/models"
import {
  ChatGPTLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  AIOverviewLogo,
  PerplexityLogo,
} from "./model-logos"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Priority = "critical" | "high" | "medium" | "low"
type GapStatus = "not_addressed" | "in_progress" | "partially_covered"

interface ContentGap {
  id: string
  topic: string
  description: string
  priority: Priority
  status: GapStatus
  affectedPrompts: number
  missedMentions: number
  competitorsCovering: number
  modelsAffected: ModelKey[]
  recommendation: string
  examplePrompts: string[]
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const MODEL_LOGOS: Record<string, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
}

const gaps: ContentGap[] = [
  {
    id: "gap-1",
    topic: "EV Inventory & Charging Infrastructure",
    description: "No dedicated content addressing electric vehicle inventory, charging station locations, available incentives, or EV-specific dealer services.",
    priority: "critical",
    status: "not_addressed",
    affectedPrompts: 12,
    missedMentions: 47,
    competitorsCovering: 4,
    modelsAffected: ["chatgpt", "claude", "gemini", "aioverview", "perplexity"],
    recommendation: "Create dedicated EV landing pages with inventory filters, charging info, and federal/state incentive calculators.",
    examplePrompts: [
      "best EV dealerships near me with charging stations",
      "dealer websites with electric vehicle inventory tools",
      "how to find EV incentives through car dealerships",
    ],
  },
  {
    id: "gap-2",
    topic: "Online Service Scheduling & Recall Notifications",
    description: "Missing content around online service booking workflows, recall notification systems, and maintenance package comparisons.",
    priority: "critical",
    status: "in_progress",
    affectedPrompts: 9,
    missedMentions: 38,
    competitorsCovering: 3,
    modelsAffected: ["chatgpt", "claude", "gemini", "copilot"],
    recommendation: "Publish comparison guides for online service scheduling tools and integrate recall notification features into dealer website platforms.",
    examplePrompts: [
      "car dealer websites with online service scheduling",
      "how to get recall notifications from my dealership",
      "best dealer platforms for maintenance reminders",
    ],
  },
  {
    id: "gap-3",
    topic: "Trade-In Value Tools & Instant Appraisals",
    description: "Lack of content comparing trade-in valuation methodologies, instant appraisal technologies, and integration with dealer websites.",
    priority: "high",
    status: "not_addressed",
    affectedPrompts: 7,
    missedMentions: 29,
    competitorsCovering: 3,
    modelsAffected: ["chatgpt", "claude", "perplexity"],
    recommendation: "Create comparison content for trade-in tools (KBB, Edmunds, proprietary) and showcase how dealer websites can offer instant appraisals.",
    examplePrompts: [
      "dealer website platforms with instant trade-in appraisals",
      "best online trade-in value tools for car dealerships",
      "how to add trade-in calculator to dealer website",
    ],
  },
  {
    id: "gap-4",
    topic: "F&I Digital Retailing Integration",
    description: "No visibility into how dealer websites handle Finance & Insurance products digitally, from credit applications to aftermarket product presentations.",
    priority: "high",
    status: "partially_covered",
    affectedPrompts: 6,
    missedMentions: 24,
    competitorsCovering: 2,
    modelsAffected: ["chatgpt", "aioverview", "gemini"],
    recommendation: "Develop content showcasing digital F&I workflows, online credit application features, and aftermarket product presentation tools.",
    examplePrompts: [
      "dealer websites with online financing applications",
      "digital retailing F&I solutions for car dealers",
      "best platforms for online car buying with financing",
    ],
  },
  {
    id: "gap-5",
    topic: "Multi-Location Dealer Group Management",
    description: "Limited content about managing multiple dealership locations, centralized inventory, and group-level analytics dashboards.",
    priority: "medium",
    status: "not_addressed",
    affectedPrompts: 5,
    missedMentions: 18,
    competitorsCovering: 2,
    modelsAffected: ["chatgpt", "claude"],
    recommendation: "Create case studies and feature pages for multi-rooftop dealer groups showing centralized management capabilities.",
    examplePrompts: [
      "best website platforms for dealer groups with multiple locations",
      "centralized inventory management for auto dealer groups",
    ],
  },
  {
    id: "gap-6",
    topic: "ADA Compliance & Accessibility Standards",
    description: "Insufficient content about website accessibility compliance, WCAG standards, and ADA lawsuit protection for automotive dealers.",
    priority: "medium",
    status: "in_progress",
    affectedPrompts: 4,
    missedMentions: 15,
    competitorsCovering: 2,
    modelsAffected: ["chatgpt", "perplexity", "copilot"],
    recommendation: "Publish comprehensive ADA compliance guides specific to dealer websites, including WCAG 2.1 checklists and compliance monitoring features.",
    examplePrompts: [
      "ADA compliant car dealer website providers",
      "WCAG compliance for automotive dealership websites",
    ],
  },
  {
    id: "gap-7",
    topic: "Conversational AI & Chat Solutions",
    description: "Missing content about AI-powered chat widgets, conversational commerce, and automated lead qualification for dealer websites.",
    priority: "low",
    status: "not_addressed",
    affectedPrompts: 3,
    missedMentions: 11,
    competitorsCovering: 1,
    modelsAffected: ["chatgpt", "gemini"],
    recommendation: "Create content about AI chat integration, chatbot lead qualification workflows, and conversational commerce for automotive.",
    examplePrompts: [
      "AI chatbots for car dealership websites",
      "best chat solutions for automotive leads",
    ],
  },
  {
    id: "gap-8",
    topic: "Video Integration & Virtual Showroom",
    description: "No content covering video walkarounds, virtual showroom experiences, or video-first inventory presentation on dealer websites.",
    priority: "low",
    status: "partially_covered",
    affectedPrompts: 3,
    missedMentions: 9,
    competitorsCovering: 1,
    modelsAffected: ["chatgpt", "aioverview"],
    recommendation: "Develop content showcasing video integration features, virtual test drives, and 360-degree vehicle views on dealer websites.",
    examplePrompts: [
      "dealer websites with video walkaround features",
      "virtual showroom solutions for car dealerships",
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: "oklch(0.55 0.22 25)", bg: "oklch(0.55 0.22 25 / 0.1)" },
  high: { label: "High", color: "oklch(0.7 0.16 75)", bg: "oklch(0.7 0.16 75 / 0.1)" },
  medium: { label: "Medium", color: "var(--primary)", bg: "oklch(0.25 0.06 250 / 0.1)" },
  low: { label: "Low", color: "var(--muted-foreground)", bg: "oklch(0.48 0.006 60 / 0.1)" },
}

const STATUS_CONFIG: Record<GapStatus, { label: string; color: string; bg: string }> = {
  not_addressed: { label: "Not Addressed", color: "oklch(0.55 0.22 25)", bg: "oklch(0.55 0.22 25 / 0.1)" },
  in_progress: { label: "In Progress", color: "oklch(0.7 0.16 75)", bg: "oklch(0.7 0.16 75 / 0.1)" },
  partially_covered: { label: "Partially Covered", color: "oklch(0.55 0.19 155)", bg: "oklch(0.55 0.19 155 / 0.1)" },
}

function getScoreColor(value: number): string {
  const hue = (Math.max(0, Math.min(100, value)) / 100) * 142
  return `oklch(0.62 0.2 ${hue})`
}

function Ring({ value, size = 64, stroke = 6 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const color = getScoreColor(value)
  return (
    <svg width={size} height={size} className="shrink-0 rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" stroke="var(--muted)" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        strokeWidth={stroke} fill="none"
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={circ - (value / 100) * circ}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CoverageSummary() {
  const coverage = 37
  const totalGaps = gaps.length
  const criticalCount = gaps.filter((g) => g.priority === "critical").length
  const notAddressed = gaps.filter((g) => g.status === "not_addressed").length
  const totalMissed = gaps.reduce((sum, g) => sum + g.missedMentions, 0)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Coverage Ring */}
      <Card className="border-border bg-card">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="relative">
            <Ring value={coverage} size={72} stroke={7} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">{coverage}%</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-foreground">Content Coverage</p>
              <HelpTooltip title="Content Coverage">
                Percentage of tracked topics where your website has sufficient content to appear in AI model responses. Higher is better.
              </HelpTooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{totalGaps} gaps identified</p>
          </div>
        </CardContent>
      </Card>

      {/* Critical Gaps */}
      <Card className="border-border bg-card">
        <CardContent className="flex items-center gap-4 py-5">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: PRIORITY_CONFIG.critical.bg }}
          >
            <AlertTriangle className="size-5" style={{ color: PRIORITY_CONFIG.critical.color }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Critical Gaps</p>
          </div>
        </CardContent>
      </Card>

      {/* Not Addressed */}
      <Card className="border-border bg-card">
        <CardContent className="flex items-center gap-4 py-5">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "oklch(0.55 0.22 25 / 0.1)" }}
          >
            <Target className="size-5" style={{ color: "oklch(0.55 0.22 25)" }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{notAddressed}</p>
            <p className="text-xs text-muted-foreground">Not Addressed</p>
          </div>
        </CardContent>
      </Card>

      {/* Missed Mentions */}
      <Card className="border-border bg-card">
        <CardContent className="flex items-center gap-4 py-5">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "oklch(0.7 0.16 75 / 0.1)" }}
          >
            <TrendingDown className="size-5" style={{ color: "oklch(0.7 0.16 75)" }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalMissed}</p>
            <p className="text-xs text-muted-foreground">Missed Mentions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GapExpandedRow({ gap }: { gap: ContentGap }) {
  return (
    <TableRow className="border-border hover:bg-transparent">
      <TableCell colSpan={7} className="p-0">
        <div className="border-t border-border bg-secondary/30 px-6 py-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Description */}
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Gap Description
              </p>
              <p className="text-xs leading-relaxed text-foreground">{gap.description}</p>
            </div>

            {/* Recommendation */}
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recommendation
              </p>
              <div className="flex items-start gap-2">
                <Lightbulb className="size-3.5 mt-0.5 shrink-0 text-warning" />
                <p className="text-xs leading-relaxed text-foreground">{gap.recommendation}</p>
              </div>
            </div>

            {/* Example Prompts */}
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Example Prompts Missing Your Brand
              </p>
              <div className="flex flex-col gap-1.5">
                {gap.examplePrompts.map((prompt) => (
                  <div
                    key={prompt}
                    className="flex items-start gap-2 rounded-md border border-border bg-card px-2.5 py-1.5"
                  >
                    <Search className="size-3 mt-0.5 shrink-0 text-muted-foreground" />
                    <p className="text-[11px] leading-relaxed text-foreground">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

function GapsTable({
  filteredGaps,
}: {
  filteredGaps: ContentGap[]
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-semibold text-foreground">Content Gaps</CardTitle>
          <HelpTooltip title="Content Gaps">
            Topics where users are asking AI models questions but your brand is not appearing in responses. Each gap shows how many prompts and potential mentions you are missing, along with actionable recommendations.
          </HelpTooltip>
        </div>
        <CardDescription className="text-xs">
          {filteredGaps.length} gap{filteredGaps.length !== 1 ? "s" : ""} identified across tracked topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-8" />
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Topic
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1">
                  Priority
                  <HelpTooltip>Based on the number of affected prompts, missed mentions, and competitor coverage.</HelpTooltip>
                </span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Status
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-center">
                <span className="inline-flex items-center gap-1">
                  Prompts
                  <HelpTooltip>Number of tracked prompts where your brand is missing due to this content gap.</HelpTooltip>
                </span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-center">
                <span className="inline-flex items-center gap-1">
                  Missed
                  <HelpTooltip>Estimated mentions you are losing because this content gap is not addressed.</HelpTooltip>
                </span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1">
                  Models Affected
                  <HelpTooltip>AI models where this content gap causes your brand to be excluded from responses.</HelpTooltip>
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGaps.map((gap) => {
              const isExpanded = expandedId === gap.id
              const priorityCfg = PRIORITY_CONFIG[gap.priority]
              const statusCfg = STATUS_CONFIG[gap.status]

              return (
                <>
                  <TableRow
                    key={gap.id}
                    className="border-border cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : gap.id)}
                  >
                    <TableCell className="w-8 pr-0">
                      <button
                        className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={isExpanded ? "Collapse row" : "Expand row"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="max-w-[280px]">
                      <div className="flex flex-col gap-0.5">
                        <TruncatedText className="text-xs font-medium text-foreground">
                          {gap.topic}
                        </TruncatedText>
                        {gap.competitorsCovering > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {gap.competitorsCovering} competitor{gap.competitorsCovering !== 1 ? "s" : ""} covering this
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: priorityCfg.bg, color: priorityCfg.color }}
                      >
                        {priorityCfg.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-semibold tabular-nums text-foreground">
                        {gap.affectedPrompts}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-semibold tabular-nums" style={{ color: "oklch(0.55 0.22 25)" }}>
                        {gap.missedMentions}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex gap-1">
                          {gap.modelsAffected.map((modelKey) => {
                            const config = MODEL_CONFIG[modelKey]
                            const Logo = MODEL_LOGOS[modelKey]
                            return (
                              <Tooltip key={modelKey}>
                                <TooltipTrigger asChild>
                                  <span
                                    className="flex size-6 items-center justify-center rounded-md cursor-pointer"
                                    style={{ backgroundColor: `${config.hex}15`, color: config.hex }}
                                  >
                                    {Logo && <Logo size={12} />}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-popover text-popover-foreground border-border">
                                  <p className="text-xs">{config.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                  {isExpanded && <GapExpandedRow key={`${gap.id}-expanded`} gap={gap} />}
                </>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function TopRecommendations() {
  const topGaps = gaps
    .filter((g) => g.priority === "critical" || g.priority === "high")
    .slice(0, 3)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-semibold text-foreground">Top Recommendations</CardTitle>
          <HelpTooltip title="Top Recommendations">
            The highest-impact content gaps to address first, based on priority scoring and potential mention recovery.
          </HelpTooltip>
        </div>
        <CardDescription className="text-xs">
          Highest-impact gaps to address first
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {topGaps.map((gap, i) => {
            const priorityCfg = PRIORITY_CONFIG[gap.priority]
            return (
              <div
                key={gap.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary"
              >
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                  style={{ backgroundColor: priorityCfg.bg, color: priorityCfg.color }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{gap.topic}</p>
                    <span
                      className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                      style={{ backgroundColor: priorityCfg.bg, color: priorityCfg.color }}
                    >
                      {priorityCfg.label}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mt-1.5">
                    <Lightbulb className="size-3 mt-0.5 shrink-0 text-warning" />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {gap.recommendation}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <FileText className="size-3" />
                      <span>{gap.affectedPrompts} prompts affected</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "oklch(0.55 0.22 25)" }}>
                      <TrendingDown className="size-3" />
                      <span className="font-semibold">{gap.missedMentions} missed mentions</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <ExternalLink className="size-3" />
                      <span>{gap.competitorsCovering} competitors covering</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function ContentGapsDetail() {
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [statusFilter, setStatusFilter] = useState<GapStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGaps = useMemo(() => {
    return gaps.filter((gap) => {
      if (priorityFilter !== "all" && gap.priority !== priorityFilter) return false
      if (statusFilter !== "all" && gap.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          gap.topic.toLowerCase().includes(q) ||
          gap.description.toLowerCase().includes(q) ||
          gap.recommendation.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [priorityFilter, statusFilter, searchQuery])

  const hasActiveFilters = priorityFilter !== "all" || statusFilter !== "all" || searchQuery !== ""

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <CoverageSummary />

      {/* Recommendations */}
      <SectionHeader
        title="Top Recommendations"
        tooltip="Highest-impact content gaps that should be addressed first to maximize your AI visibility."
      />
      <TopRecommendations />

      {/* Gaps Table */}
      <SectionHeader
        title="All Content Gaps"
        tooltip="Complete list of identified content gaps with filtering and detail views."
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search gaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-input-bg pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | "all")}>
          <SelectTrigger className="h-9 w-[140px] text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as GapStatus | "all")}>
          <SelectTrigger className="h-9 w-[160px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="not_addressed">Not Addressed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="partially_covered">Partially Covered</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              setPriorityFilter("all")
              setStatusFilter("all")
              setSearchQuery("")
            }}
          >
            <X className="size-3" />
            Clear filters
          </Button>
        )}
      </div>

      <GapsTable filteredGaps={filteredGaps} />
    </div>
  )
}
