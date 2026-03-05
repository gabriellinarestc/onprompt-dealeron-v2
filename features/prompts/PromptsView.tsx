"use client"

import { Plus, Download, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import { TruncatedText } from "@/components/patterns/truncated-text"
import { DifficultyTag, getDifficultyLevel } from "@/components/ui/tag"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import type { PromptsData, PageInfo, BrandNames } from "./types"
import type { PromptsEvents } from "./events"

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
  if (volume < 5000) return "1K - 5K"
  if (volume < 10000) return "5K - 10K"
  if (volume < 25000) return "10K - 25K"
  if (volume < 50000) return "25K - 50K"
  if (volume < 100000) return "50K - 100K"
  return "100K+"
}

function SentimentBar({ value }: { value: number }) {
  const color = getSentimentColor(value)
  const clampedLeft = Math.max(8, Math.min(92, value))
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative h-2 w-16 rounded-full"
        style={{ background: "linear-gradient(to right, oklch(0.55 0.22 25), oklch(0.7 0.16 75), oklch(0.55 0.19 155))" }}
      >
        <div
          className="absolute size-2.5 rounded-full border-2 border-background"
          style={{
            left: `${clampedLeft}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: color,
          }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>{value}</span>
    </div>
  )
}

function AnalyzingSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-12 animate-pulse rounded-full bg-muted" />
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
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-14 animate-pulse rounded bg-muted" />
            <div className="flex gap-1">
              <div className="size-6 animate-pulse rounded-full bg-muted" />
              <div className="size-6 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50] as const

export type PromptsViewProps = {
  state: "loading" | "empty" | "error" | "ready" | "no-results"
  data?: PromptsData
  brandNames?: BrandNames
  error?: { title: string; message: string; code?: string }
  pageInfo?: PageInfo
  searchQuery?: string
} & PromptsEvents

export function PromptsView({
  state,
  data,
  brandNames: brands = {},
  error,
  pageInfo,
  searchQuery = "",
  onSearch,
  onCreate,
  onExport,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onRetry,
}: PromptsViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prompts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and analyze prompts mentioning your brand across AI models
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2" onClick={onCreate}>
            <Plus className="size-4" />
            Create Prompt
          </Button>
          <Button variant="outline" className="gap-2" onClick={onExport}>
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by prompt text..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            className="h-10 pl-9 bg-card border-border"
          />
        </div>
        {pageInfo && (
          <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
            {pageInfo.totalItems} {pageInfo.totalItems === 1 ? "prompt" : "prompts"}
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
                  <Search className="size-5" />
                </EmptyMedia>
                <EmptyTitle>No prompts yet</EmptyTitle>
                <EmptyDescription>
                  Start tracking AI mentions by creating your first prompt.
                </EmptyDescription>
              </EmptyHeader>
              <Button className="gap-2 mt-4" onClick={onCreate}>
                <Plus className="size-4" />
                Create Prompt
              </Button>
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
                <EmptyTitle>No prompts match your search</EmptyTitle>
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
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pl-6">
                    Prompt
                  </TableHead>
                  <TableHead className="w-[130px] text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Visibility
                      <HelpTooltip title="Visibility">
                        Measures how prominently your brand appears in AI responses, combining mention frequency, citation quality, and positioning.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="w-[180px] text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Sentiment
                      <HelpTooltip title="Sentiment">
                        How positively AI models describe your brand when responding to this prompt. 0 = negative, 100 = very positive.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="w-[140px] text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Volume
                      <HelpTooltip title="Volume">
                        The estimated monthly search volume range for this prompt across all AI platforms.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="w-[130px] text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      Difficulty
                      <HelpTooltip title="Difficulty">
                        How hard it is to improve your visibility for this prompt. Lower is easier.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px] text-[10px] uppercase tracking-wider text-muted-foreground font-medium pr-6">
                    <span className="inline-flex items-center gap-1">
                      Brands
                      <HelpTooltip title="Brands">
                        Which tracked brands are mentioned by AI models in response to this prompt.
                      </HelpTooltip>
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => {
                  const visibleBrands = item.brands.slice(0, 2)
                  const hiddenBrands = item.brands.slice(2)
                  return (
                  <TableRow
                    key={item.id}
                    className={`border-border ${item.isAnalyzing ? "bg-muted/30" : ""} ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick?.(item.id)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2 min-w-0">
                        <TruncatedText className="text-sm text-foreground">
                          {item.prompt}
                        </TruncatedText>
                        {item.isAnalyzing && (
                          <span className="shrink-0 text-xs text-muted-foreground italic">
                            Analyzing — this can take up to 24 hours.
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.isAnalyzing ? (
                        <AnalyzingSkeleton />
                      ) : item.visibilityScore != null ? (
                        <span
                          className="text-sm font-semibold tabular-nums"
                          style={{ color: getScoreColor(item.visibilityScore) }}
                        >
                          {item.visibilityScore}%
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.isAnalyzing ? (
                        <AnalyzingSkeleton />
                      ) : item.sentiment != null ? (
                        <SentimentBar value={item.sentiment} />
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.isAnalyzing ? (
                        <AnalyzingSkeleton />
                      ) : item.volume != null ? (
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {formatVolumeRange(item.volume)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.isAnalyzing ? (
                        <AnalyzingSkeleton />
                      ) : item.difficulty != null ? (
                        <DifficultyTag value={item.difficulty} />
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-6">
                      {item.isAnalyzing ? (
                        <AnalyzingSkeleton />
                      ) : (
                        <TooltipProvider>
                          <div className="flex gap-1">
                            {visibleBrands.map((b) => (
                              <Tooltip key={b}>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="size-6 items-center justify-center rounded-full border-border p-0 text-[10px] text-muted-foreground cursor-pointer hover:bg-muted"
                                  >
                                    {b}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-popover text-popover-foreground border-border">
                                  <p className="text-xs">{brands[b] ?? b}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                            {hiddenBrands.length > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="size-6 items-center justify-center rounded-full border-border p-0 text-[10px] text-muted-foreground cursor-pointer hover:bg-muted"
                                  >
                                    +{hiddenBrands.length}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-popover text-popover-foreground border-border">
                                  <div className="flex flex-col gap-0.5">
                                    {hiddenBrands.map((b) => (
                                      <p key={b} className="text-xs">{brands[b] ?? b}</p>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TooltipProvider>
                      )}
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
