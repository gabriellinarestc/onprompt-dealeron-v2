"use client"

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
import { ArrowRight } from "lucide-react"
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, AIOverviewLogo, PerplexityLogo, CopilotLogo } from "./model-logos"
import { useModelFilter } from "./model-filter-context"
import { resolveModelKey } from "@/lib/models"
import { HelpTooltip } from "./help-tooltip"

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
  const filteredModels = topModels.filter((item) => {
    const key = resolveModelKey(item.model)
    return key ? isModelActive(key) : true
  })

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
                <TableHead className="text-right text-[10px] uppercase tracking-wider text-primary font-medium">
                  Visitors
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Crawls
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPages.map((item) => (
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
                <TableHead className="text-right text-[10px] uppercase tracking-wider text-primary font-medium">
                  Visitors
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Crawls
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((item) => (
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
