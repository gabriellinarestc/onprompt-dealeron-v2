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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowRight } from "lucide-react"
import { HelpTooltip } from "./help-tooltip"

function getTemperatureColor(value: number): string {
  if (value >= 80) return "oklch(0.55 0.19 155)"  // green
  if (value >= 60) return "oklch(0.65 0.17 115)"  // yellow-green
  if (value >= 40) return "oklch(0.7 0.16 75)"    // amber
  return "oklch(0.55 0.22 25)"                     // red
}

function getTemperatureGradient(value: number): string {
  // Returns a gradient stop position for the bar
  if (value >= 80) return "oklch(0.55 0.19 155)"
  if (value >= 60) return "oklch(0.65 0.17 115)"
  if (value >= 40) return "oklch(0.7 0.16 75)"
  return "oklch(0.55 0.22 25)"
}

const brandNames: Record<string, string> = {
  T: "TechCorp",
  D: "DataFlow",
  C: "CloudBase",
  M: "MetaAI",
}

const promptsData = [
  {
    prompt: "best practices for react performance optimization",
    sentiment: 92,
    visibility: "87%",
    brands: ["T", "D", "C"],
  },
  {
    prompt: "how to use react hooks effectively",
    sentiment: 88,
    visibility: "92%",
    brands: ["T", "D"],
  },
  {
    prompt: "implement error handling in javascript applications",
    sentiment: 85,
    visibility: "74%",
    brands: ["T"],
  },
  {
    prompt: "best ai tools for content creators",
    sentiment: 92,
    visibility: "65%",
    brands: ["C", "M"],
  },
  {
    prompt: "web development trends 2025",
    sentiment: 92,
    visibility: "78%",
    brands: ["T", "D", "C"],
  },
  {
    prompt: "how to build scalable node.js applications",
    sentiment: 79,
    visibility: "81%",
    brands: ["T", "D"],
  },
  {
    prompt: "typescript best practices for large codebases",
    sentiment: 94,
    visibility: "89%",
    brands: ["T", "C"],
  },
  {
    prompt: "serverless architecture benefits and drawbacks",
    sentiment: 76,
    visibility: "62%",
    brands: ["D", "M"],
  },
  {
    prompt: "next.js vs remix comparison 2025",
    sentiment: 83,
    visibility: "71%",
    brands: ["T", "D", "C"],
  },
]

function SentimentBar({ value }: { value: number }) {
  const color = getTemperatureColor(value)
  // Clamp left% so the dot doesn't overflow the bar edges
  const clampedLeft = Math.max(8, Math.min(92, value))
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative h-2 w-20 rounded-full"
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
      <span className="text-[11px] font-semibold tabular-nums" style={{ color }}>{value}</span>
    </div>
  )
}

export function TopPrompts() {
  return (
    <Card className="border-border bg-card h-full flex flex-col">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">Top Prompts</h3>
          <HelpTooltip title="Top Prompts">
            The most frequent prompts where your brand appears in AI model responses. Sentiment shows how positively your brand is described, visibility shows how often your brand appears for that prompt.
          </HelpTooltip>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/prompts">
            View All
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <CardContent className="flex-1 flex flex-col">
        <Table className="flex-1">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Prompt
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1">Sentiment <HelpTooltip>How positively the AI model describes your brand for this prompt. 0 = negative, 100 = very positive.</HelpTooltip></span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1">Visibility <HelpTooltip>The percentage of times your brand is mentioned when this prompt is asked across all tracked models.</HelpTooltip></span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Brands
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promptsData.map((item) => (
              <TableRow key={item.prompt} className="border-border">
                <TableCell className="max-w-[250px] truncate text-xs text-foreground">
                  {item.prompt}
                </TableCell>
                <TableCell>
                  <SentimentBar value={item.sentiment} />
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold tabular-nums" style={{ color: getTemperatureColor(parseInt(item.visibility)) }}>
                    {item.visibility}
                  </span>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex gap-1">
                      {item.brands.map((b) => (
                        <Tooltip key={b}>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="size-5 items-center justify-center rounded-full border-border p-0 text-[10px] text-muted-foreground cursor-pointer"
                            >
                              {b}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="text-xs">{brandNames[b]}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
