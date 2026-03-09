"use client"

import { Download, Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, RefreshCw, FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tag } from "@/components/ui/tag"
import { Skeleton } from "@/components/ui/skeleton"
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
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import { TruncatedText } from "@/components/patterns/truncated-text"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import type { ContentGapsData, CoverageStats, ContentRecommendation, PageInfo } from "./types"
import type { ContentGapsEvents } from "./events"

// ─── Color utilities ─────────────────────────────────────────────────────────

function getCoverageColor(percent: number): string {
  if (percent >= 70) return "oklch(0.55 0.19 155)"
  if (percent >= 40) return "oklch(0.7 0.16 75)"
  return "oklch(0.55 0.22 25)"
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CoverageRing({ percent, size = 100, stroke = 8 }: { percent: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const color = getCoverageColor(percent)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" stroke="var(--muted)" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={stroke} fill="none"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={circ - (percent / 100) * circ}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{percent}%</span>
      </div>
    </div>
  )
}

function CoverageCard({ stats }: { stats: CoverageStats }) {
  const isPositive = stats.changePercent >= 0
  return (
    <Card className="border-border bg-card h-full">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">Content Coverage</h3>
          <HelpTooltip title="Content Coverage">
            Percentage of tracked prompts where your brand appears in AI model responses. Higher coverage means better visibility.
          </HelpTooltip>
        </div>
      </div>
      <CardContent>
        <div className="flex items-center gap-6 rounded-lg bg-secondary p-4">
          <CoverageRing percent={stats.coveragePercent} />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <ChevronUp className="size-3.5 text-success" />
              ) : (
                <ChevronDown className="size-3.5 text-destructive" />
              )}
              <span className={`text-sm font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
                {isPositive ? "+" : ""}{stats.changePercent}% vs last period
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.promptsCovered} of {stats.totalPrompts} prompts covered
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Full Coverage</span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">{stats.fullCoverage}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">Partial Coverage</span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">{stats.partialCoverage}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">No Coverage</span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">{stats.noCoverage}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendationsCard({ recommendations }: { recommendations: ContentRecommendation[] }) {
  return (
    <Card className="border-border bg-card h-full">
      <div className="px-6">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">AI Recommendations</h3>
          <HelpTooltip title="AI Recommendations">
            Suggested actions to improve your brand coverage in AI model responses.
          </HelpTooltip>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Top actions to improve your content coverage
        </p>
      </div>
      <CardContent>
        <div className="flex flex-col gap-2">
          {recommendations.map((item) => (
            <div
              key={item.rank}
              className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
            >
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                {item.rank}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground">{item.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary text-[10px]">
                {item.prompts} prompts
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Skeletons ───────────────────────────────────────────────────────────────

function TopCardsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="border-border bg-card lg:col-span-2">
        <div className="px-6"><Skeleton className="h-4 w-32" /></div>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6 rounded-lg bg-secondary p-4">
            <Skeleton className="size-[100px] rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-border bg-card lg:col-span-3">
        <div className="px-6"><Skeleton className="h-4 w-44" /></div>
        <CardContent className="space-y-3">
          <Skeleton className="h-3 w-64" />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function TableSkeleton() {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="px-6 py-4 border-b border-border">
          <Skeleton className="h-3 w-32" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4">
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Main View ───────────────────────────────────────────────────────────────

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50] as const

export type ContentGapsViewProps = {
  state: "loading" | "empty" | "error" | "ready" | "no-results"
  data?: ContentGapsData
  error?: { title: string; message: string; code?: string }
  pageInfo?: PageInfo
  searchQuery?: string
} & ContentGapsEvents

export function ContentGapsView({
  state,
  data,
  error,
  pageInfo,
  searchQuery = "",
  onSearch,
  onExport,
  onRowClick,
  onPageChange,
  onPageSizeChange,
  onRetry,
}: ContentGapsViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Gap Analysis</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Identify coverage opportunities and track content performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={onExport}>
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Top Cards — dashboard widget style */}
      {state === "loading" && <TopCardsSkeleton />}
      {(state === "ready" || state === "no-results") && data && (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <CoverageCard stats={data.stats} />
          </div>
          <div className="lg:col-span-3">
            {data.recommendations.length > 0 && (
              <RecommendationsCard recommendations={data.recommendations} />
            )}
          </div>
        </div>
      )}

      {/* Search Bar — same as Prompts page */}
      {state !== "loading" && state !== "error" && state !== "empty" && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search content gaps..."
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
              className="h-10 pl-9 bg-card border-border"
            />
          </div>
          {pageInfo && (
            <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
              {pageInfo.totalItems} {pageInfo.totalItems === 1 ? "gap" : "gaps"}
            </Badge>
          )}
        </div>
      )}

      {/* States */}
      {state === "loading" && <TableSkeleton />}

      {state === "empty" && (
        <Card className="border-border bg-card">
          <CardContent className="py-16">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileSearch className="size-5" />
                </EmptyMedia>
                <EmptyTitle>No content gaps detected</EmptyTitle>
                <EmptyDescription>
                  Your content coverage looks great! All tracked topics are covered by your brand in AI responses.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}

      {state === "no-results" && (
        <Card className="border-border bg-card">
          <CardContent className="py-16">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search className="size-5" />
                </EmptyMedia>
                <EmptyTitle>No gaps match your search</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search terms or clearing the filter.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}

      {state === "error" && error && (
        <Card className="border-border bg-card">
          <CardContent className="py-16">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{error.title}</EmptyTitle>
                <EmptyDescription>{error.message}</EmptyDescription>
                {error.code && (
                  <p className="mt-1 text-xs text-muted-foreground">Code: {error.code}</p>
                )}
              </EmptyHeader>
              <Button variant="outline" className="gap-2 mt-4" onClick={onRetry}>
                <RefreshCw className="size-4" />
                Retry
              </Button>
            </Empty>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {state === "ready" && data && (
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pl-6">
                    Prompt
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-[120px]">
                    <span className="inline-flex items-center gap-1">
                      Coverage %
                      <HelpTooltip title="Coverage Percentage">
                        How much of the AI responses for this prompt include your brand. Higher is better.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Citations
                      <HelpTooltip title="Citations">
                        Number of times your brand is cited as a source in AI responses for this prompt.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Queries
                      <HelpTooltip title="Related Queries">
                        Number of related queries AI models generate when processing this prompt.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    % Change
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pr-6">
                    Last Analyzed
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => {
                  const isPositive = item.changePercent >= 0
                  return (
                    <TableRow
                      key={item.id}
                      className={`border-border ${onRowClick ? "cursor-pointer" : ""}`}
                      onClick={() => onRowClick?.(item.id)}
                    >
                      <TableCell className="max-w-[300px] pl-6">
                        <TruncatedText className="text-sm font-medium text-foreground">
                          {item.prompt}
                        </TruncatedText>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold tabular-nums" style={{ color: getCoverageColor(item.coveragePercent) }}>
                          {item.coveragePercent}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {item.citations}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm tabular-nums text-foreground">
                          {item.queries}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Tag variant={isPositive ? "low" : "danger"} className="gap-0.5">
                          {isPositive ? (
                            <ChevronUp className="size-3" />
                          ) : (
                            <ChevronDown className="size-3" />
                          )}
                          {isPositive ? "+" : ""}{item.changePercent}%
                        </Tag>
                      </TableCell>
                      <TableCell className="pr-6">
                        <span className="text-sm text-muted-foreground">{item.lastAnalyzed}</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pageInfo && pageInfo.totalPages > 0 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show</span>
                  <Select
                    value={String(pageInfo.pageSize)}
                    onValueChange={(v) => onPageSizeChange?.(Number(v))}
                  >
                    <SelectTrigger size="sm" className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTS_PER_PAGE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">per page</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {(pageInfo.page - 1) * pageInfo.pageSize + 1}-
                    {Math.min(pageInfo.page * pageInfo.pageSize, pageInfo.totalItems)} of{" "}
                    {pageInfo.totalItems}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={() => onPageChange?.(pageInfo.page - 1)}
                      disabled={pageInfo.page === 1}
                    >
                      <ChevronLeft className="size-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={() => onPageChange?.(pageInfo.page + 1)}
                      disabled={pageInfo.page === pageInfo.totalPages}
                    >
                      <ChevronRight className="size-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
