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
import { ArrowRight, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, AIOverviewLogo, PerplexityLogo, CopilotLogo } from "./model-logos"
import { useModelFilter } from "./model-filter-context"
import { resolveModelKey } from "@/lib/models"
import { HelpTooltip } from "./help-tooltip"
import { cn } from "@/lib/utils"

type SortDirection = "asc" | "desc" | null
type PageSortField = "visitors" | "crawls"
type ModelSortField = "visitors" | "crawls"

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

const topPages = [
  { page: "/", visitors: 842, crawls: "312.4k" },
  { page: "/dealer-websites/", visitors: 467, crawls: "48.7k" },
  { page: "/seo-solutions/", visitors: 389, crawls: "35.2k" },
  { page: "/digital-advertising/", visitors: 274, crawls: "22.1k" },
  { page: "/case-studies/", visitors: 198, crawls: "18.6k" },
]

const topModels = [
  { model: "chatgpt.com", visitors: 1243, crawls: "716.4k" },
  { model: "claude.ai", visitors: 587, crawls: "338.5k" },
  { model: "gemini.google.com", visitors: 418, crawls: "124.8k" },
  { model: "google.com/search", visitors: 356, crawls: "245.2k" },
  { model: "perplexity.ai", visitors: 209, crawls: "116.4k" },
  { model: "copilot.microsoft.com", visitors: 142, crawls: "58.9k" },
]

export function TopPagesModels() {
  const { isModelActive } = useModelFilter()
  
  // Sorting state for Top Pages
  const [pagesSortField, setPagesSortField] = useState<PageSortField | null>(null)
  const [pagesSortDir, setPagesSortDir] = useState<SortDirection>(null)
  
  // Sorting state for Top Models
  const [modelsSortField, setModelsSortField] = useState<ModelSortField | null>(null)
  const [modelsSortDir, setModelsSortDir] = useState<SortDirection>(null)

  const handlePagesSort = (field: PageSortField) => {
    if (pagesSortField === field) {
      if (pagesSortDir === "desc") setPagesSortDir("asc")
      else if (pagesSortDir === "asc") { setPagesSortField(null); setPagesSortDir(null) }
      else setPagesSortDir("desc")
    } else {
      setPagesSortField(field)
      setPagesSortDir("desc")
    }
  }

  const handleModelsSort = (field: ModelSortField) => {
    if (modelsSortField === field) {
      if (modelsSortDir === "desc") setModelsSortDir("asc")
      else if (modelsSortDir === "asc") { setModelsSortField(null); setModelsSortDir(null) }
      else setModelsSortDir("desc")
    } else {
      setModelsSortField(field)
      setModelsSortDir("desc")
    }
  }

  const sortedPages = useMemo(() => {
    if (!pagesSortField || !pagesSortDir) return topPages
    return [...topPages].sort((a, b) => {
      const aVal = pagesSortField === "crawls" ? parseCrawls(a.crawls) : a.visitors
      const bVal = pagesSortField === "crawls" ? parseCrawls(b.crawls) : b.visitors
      return pagesSortDir === "desc" ? bVal - aVal : aVal - bVal
    })
  }, [pagesSortField, pagesSortDir])

  const sortedModels = useMemo(() => {
    const filtered = topModels.filter((item) => {
      const key = resolveModelKey(item.model)
      return key ? isModelActive(key) : true
    })
    if (!modelsSortField || !modelsSortDir) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = modelsSortField === "crawls" ? parseCrawls(a.crawls) : a.visitors
      const bVal = modelsSortField === "crawls" ? parseCrawls(b.crawls) : b.visitors
      return modelsSortDir === "desc" ? bVal - aVal : aVal - bVal
    })
  }, [isModelActive, modelsSortField, modelsSortDir])

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
                  <button
                    onClick={() => handlePagesSort("visitors")}
                    className={cn(
                      "flex items-center justify-end gap-1 w-full px-3 py-2 hover:bg-muted/50 transition-colors rounded-sm",
                      pagesSortField === "visitors" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Visitors
                    {pagesSortField === "visitors" ? (
                      pagesSortDir === "desc" ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />
                    ) : (
                      <ChevronsUpDown className="size-3 opacity-50" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider font-medium p-0">
                  <button
                    onClick={() => handlePagesSort("crawls")}
                    className={cn(
                      "flex items-center justify-end gap-1 w-full px-3 py-2 hover:bg-muted/50 transition-colors rounded-sm",
                      pagesSortField === "crawls" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Crawls
                    {pagesSortField === "crawls" ? (
                      pagesSortDir === "desc" ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />
                    ) : (
                      <ChevronsUpDown className="size-3 opacity-50" />
                    )}
                  </button>
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
                  <button
                    onClick={() => handleModelsSort("visitors")}
                    className={cn(
                      "flex items-center justify-end gap-1 w-full px-3 py-2 hover:bg-muted/50 transition-colors rounded-sm",
                      modelsSortField === "visitors" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Visitors
                    {modelsSortField === "visitors" ? (
                      modelsSortDir === "desc" ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />
                    ) : (
                      <ChevronsUpDown className="size-3 opacity-50" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider font-medium p-0">
                  <button
                    onClick={() => handleModelsSort("crawls")}
                    className={cn(
                      "flex items-center justify-end gap-1 w-full px-3 py-2 hover:bg-muted/50 transition-colors rounded-sm",
                      modelsSortField === "crawls" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Crawls
                    {modelsSortField === "crawls" ? (
                      modelsSortDir === "desc" ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />
                    ) : (
                      <ChevronsUpDown className="size-3 opacity-50" />
                    )}
                  </button>
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
