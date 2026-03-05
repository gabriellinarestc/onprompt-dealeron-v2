"use client"

import { Download, Search, ChevronLeft, ChevronRight, RefreshCw, FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import type { ContentGapsData, CoverageStats, PageInfo } from "./types"
import type { ContentGapsEvents } from "./events"

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high": return "bg-destructive/10 text-destructive border-destructive/20"
    case "medium": return "bg-warning/10 text-warning border-warning/20"
    case "low": return "bg-muted text-muted-foreground border-border"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

function getCoverageColor(status: string) {
  switch (status) {
    case "covered": return "oklch(0.55 0.19 155)"
    case "partially-covered": return "oklch(0.7 0.16 75)"
    case "not-covered": return "oklch(0.55 0.22 25)"
    default: return "oklch(0.55 0.22 25)"
  }
}

function getCoverageLabel(status: string) {
  switch (status) {
    case "covered": return "Covered"
    case "partially-covered": return "Partial"
    case "not-covered": return "Not Covered"
    default: return status
  }
}

function CoverageDonut({ stats }: { stats: CoverageStats }) {
  const circumference = 2 * Math.PI * 22
  return (
    <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
      <div className="relative size-14">
        <svg className="rotate-[-90deg]" width={56} height={56}>
          <circle cx={28} cy={28} r={22} strokeWidth={5} fill="none" className="stroke-muted" />
          <circle
            cx={28} cy={28} r={22}
            strokeWidth={5} fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (stats.coveragePercent / 100) * circumference}
            strokeLinecap="round"
            className="stroke-destructive"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">{stats.coveragePercent}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Content Coverage</p>
        <p className="text-xs text-muted-foreground">
          {stats.coveragePercent}% of {stats.totalTopics} tracked topics covered
        </p>
        <div className="mt-1.5 flex gap-3 text-[10px] text-muted-foreground">
          <span><span className="font-semibold text-foreground">{stats.coveredTopics}</span> covered</span>
          <span><span className="font-semibold text-foreground">{stats.partiallyCovered}</span> partial</span>
          <span><span className="font-semibold text-foreground">{stats.notCovered}</span> gaps</span>
        </div>
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4">
            <div className="h-3 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            <div className="h-5 w-14 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CoverageSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
      <div className="size-14 animate-pulse rounded-full bg-muted" />
      <div className="space-y-1.5">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

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
          <h1 className="text-2xl font-bold text-foreground">Content Gaps</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Identify topics where your brand is missing from AI model responses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={onExport}>
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Coverage Stats */}
      {state === "loading" && <CoverageSkeleton />}
      {state === "ready" && data && <CoverageDonut stats={data.stats} />}

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by topic or category..."
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

      {state === "ready" && data && (
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pl-6">
                    Topic
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Category
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Coverage
                      <HelpTooltip title="Coverage Status">
                        Whether your brand appears in AI responses for this topic. &quot;Not Covered&quot; means competitors appear but you don&apos;t.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Prompts
                      <HelpTooltip title="Related Prompts">
                        How many tracked prompts relate to this content gap topic.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Competitors
                      <HelpTooltip title="Competitor Coverage">
                        How many of your tracked competitors are covering this topic in AI responses.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pr-6">
                    Priority
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`border-border ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick?.(item.id)}
                  >
                    <TableCell className="max-w-[300px] pl-6">
                      <div className="flex flex-col gap-0.5">
                        <TruncatedText className="text-sm font-medium text-foreground">
                          {item.topic}
                        </TruncatedText>
                        <TruncatedText className="text-[11px] text-muted-foreground">
                          {item.recommendation}
                        </TruncatedText>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: getCoverageColor(item.coverageStatus) }}
                      >
                        {getCoverageLabel(item.coverageStatus)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {item.promptCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {item.competitorsCovering}/{item.totalCompetitors}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold capitalize ${getPriorityColor(item.priority)}`}
                      >
                        {item.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
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
