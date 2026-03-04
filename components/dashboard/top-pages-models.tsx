"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
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
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, PerplexityLogo, CopilotLogo } from "./model-logos"

type ModelLogoComponent = React.ComponentType<{ size?: number }>

const MODEL_LOGO_MAP: Record<string, { Logo: ModelLogoComponent; color: string }> = {
  "chatgpt.com":          { Logo: ChatGPTLogo,    color: "#10a37f" },
  "claude.ai":            { Logo: ClaudeLogo,     color: "#d97757" },
  "gemini.google.com":    { Logo: GeminiLogo,     color: "#4285f4" },
  "perplexity.ai":        { Logo: PerplexityLogo, color: "#20b8cd" },
  "copilot.microsoft.com":{ Logo: CopilotLogo,    color: "#0078d4" },
}

const topPages = [
  { page: "/", visitors: 12, crawls: "100.7k" },
  { page: "/university/", visitors: 5, crawls: "3.2k" },
  { page: "/compliance/", visitors: 2, crawls: "1.6k" },
  { page: "/blog/dealeron-acquires-sincro-from-ansi...", visitors: 2, crawls: "950" },
  { page: "/new-product-updates/", visitors: 2, crawls: "870" },
]

const topModels = [
  { model: "chatgpt.com", visitors: 22, crawls: "716.4k" },
  { model: "claude.ai", visitors: 10, crawls: "338.5k" },
  { model: "gemini.google.com", visitors: 5, crawls: "60" },
  { model: "perplexity.ai", visitors: 2, crawls: "116.4k" },
  { model: "copilot.microsoft.com", visitors: 1, crawls: "8.9k" },
]

export function TopPagesModels() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Top Pages</CardTitle>
          <CardAction>
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
          </CardAction>
        </CardHeader>
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
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Top Models</CardTitle>
          <CardAction>
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
          </CardAction>
        </CardHeader>
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
              {topModels.map((item) => (
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
