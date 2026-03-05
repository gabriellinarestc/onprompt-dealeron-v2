"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronUp, ChevronDown, ChevronsUpDown, AlertCircle } from "lucide-react"
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, AIOverviewLogo, PerplexityLogo, CopilotLogo } from "@/components/dashboard/model-logos"
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import { cn } from "@/lib/utils"
import type { TopPagesModelsProps, TopPageItem, TopModelItem } from "./types"

type SortDirection = "asc" | "desc" | null
type SortField = "visitors" | "crawls"

function parseCrawls(crawls: string): number {
  const num = parseFloat(crawls.replace(/[^0-9.]/g, ""))
  if (crawls.includes("k")) return num * 1000
  if (crawls.includes("M")) return num * 1000000
  return num
}

type ModelLogoComponent = React.ComponentType<{ size?: number }>

const MODEL_LOGO_MAP: Record<string, { Logo: ModelLogoComponent; color: string }> = {
  "chatgpt.com":          { Logo: ChatGPTLogo,    color: "#10a37f" },
  "claude.ai":            { Logo: ClaudeLogo,     color: "#d97757" },
  "gemini.google.com":    { Logo: GeminiLogo,     color: "#536dfe" },
  "google.com/search":    { Logo: AIOverviewLogo, color: "#9c5bce" },
  "perplexity.ai":        { Logo: PerplexityLogo, color: "#20b8cd" },
  "copilot.microsoft.com":{ Logo: CopilotLogo,    color: "#0078d4" },
}

function SortButton({
  label,
  field,
  activeField,
  activeDir,
  onSort,
}: {
  label: string
  field: SortField
  activeField: SortField | null
  activeDir: SortDirection
  onSort: (field: SortField) => void
}) {
  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center justify-end gap-1 w-full px-3 py-2 hover:bg-muted/50 transition-colors rounded-sm",
        activeField === field ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      {activeField === field ? (
        activeDir === "desc" ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />
      ) : (
        <ChevronsUpDown className="size-3 opacity-50" />
      )}
    </button>
  )
}

function useSort<T extends TopPageItem | TopModelItem>() {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDir === "desc") setSortDir("asc")
      else if (sortDir === "asc") { setSortField(null); setSortDir(null) }
      else setSortDir("desc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const sortData = (data: T[]) => {
    if (!sortField || !sortDir) return data
    return [...data].sort((a, b) => {
      const aVal = sortField === "crawls" ? parseCrawls(a.crawls) : a.visitors
      const bVal = sortField === "crawls" ? parseCrawls(b.crawls) : b.visitors
      return sortDir === "desc" ? bVal - aVal : aVal - bVal
    })
  }

  return { sortField, sortDir, handleSort, sortData }
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <Card key={i} className="border-border bg-card">
          <div className="flex items-center justify-between px-6">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          </div>
          <CardContent>
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card lg:col-span-2">
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground">No page or model data available</p>
            <p className="text-xs text-muted-foreground">Data will appear once AI crawlers and visitors interact with your site.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card border-destructive/20 lg:col-span-2">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-5 text-destructive" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Pages &amp; models data unavailable</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                We couldn&apos;t load this data. This is usually temporary.
              </p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                Try again
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TopPagesModelsView({ state, pages, models, onRetry }: TopPagesModelsProps) {
  const pagesSort = useSort<TopPageItem>()
  const modelsSort = useSort<TopModelItem>()

  if (state === "loading") return <LoadingSkeleton />
  if (state === "empty") return <EmptyState />
  if (state === "error") return <ErrorState onRetry={onRetry} />

  const sortedPages = pagesSort.sortData(pages)
  const sortedModels = modelsSort.sortData(models)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-foreground">Top Pages</h3>
            <HelpTooltip title="Top Pages">
              Your website pages that receive the most AI-driven traffic. Visitors are real users arriving from AI model responses, crawls are indexing requests from AI bots.
            </HelpTooltip>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-foreground hover:text-foreground" asChild>
              <Link href="/visitor-analytics">
                View Visitors
                <ArrowRight className="size-3" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-foreground hover:text-foreground" asChild>
              <Link href="/crawler-logs">
                View Crawls
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </div>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Page
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider font-medium p-0">
                  <SortButton label="Visitors" field="visitors" activeField={pagesSort.sortField} activeDir={pagesSort.sortDir} onSort={pagesSort.handleSort} />
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider font-medium p-0">
                  <SortButton label="Crawls" field="crawls" activeField={pagesSort.sortField} activeDir={pagesSort.sortDir} onSort={pagesSort.handleSort} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPages.map((item) => (
                <TableRow key={item.page} className="border-border">
                  <TableCell className="max-w-[200px] truncate font-mono text-xs text-foreground">
                    {item.page}
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium text-foreground">
                    {item.visitors}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {item.crawls}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-foreground">Top Models</h3>
            <HelpTooltip title="Top Models">
              AI models ranked by engagement with your site. Visitors are users who clicked through from an AI response, crawls show how often each model indexes your content.
            </HelpTooltip>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-foreground hover:text-foreground" asChild>
              <Link href="/visitor-analytics">
                View Visitors
                <ArrowRight className="size-3" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-foreground hover:text-foreground" asChild>
              <Link href="/crawler-logs">
                View Crawls
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </div>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Model
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider font-medium p-0">
                  <SortButton label="Visitors" field="visitors" activeField={modelsSort.sortField} activeDir={modelsSort.sortDir} onSort={modelsSort.handleSort} />
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider font-medium p-0">
                  <SortButton label="Crawls" field="crawls" activeField={modelsSort.sortField} activeDir={modelsSort.sortDir} onSort={modelsSort.handleSort} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedModels.map((item) => (
                <TableRow key={item.model} className="border-border">
                  <TableCell className="text-xs text-foreground">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const entry = MODEL_LOGO_MAP[item.model]
                        if (!entry) return <span className="size-2 rounded-full bg-primary" />
                        const Logo = entry.Logo
                        return <span style={{ color: entry.color }}><Logo size={16} /></span>
                      })()}
                      {item.model}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium text-foreground">
                    {item.visitors}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {item.crawls}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
