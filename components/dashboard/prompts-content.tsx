"use client"

import { useState } from "react"
import { Plus, Download, Search } from "lucide-react"
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
import { HelpTooltip } from "./help-tooltip"

// Color utilities
function getScoreColor(value: number): string {
  const hue = (Math.max(0, Math.min(100, value)) / 100) * 142
  return `oklch(0.62 0.2 ${hue})`
}

function getDifficultyColor(value: number): string {
  if (value <= 40) return "oklch(0.55 0.19 155)" // green - easy
  if (value <= 70) return "oklch(0.7 0.16 75)"   // amber - medium
  return "oklch(0.55 0.22 25)"                    // red - hard
}

function getSentimentColor(value: number): string {
  if (value >= 80) return "oklch(0.55 0.19 155)"
  if (value >= 60) return "oklch(0.65 0.17 115)"
  if (value >= 40) return "oklch(0.7 0.16 75)"
  return "oklch(0.55 0.22 25)"
}

// Sentiment bar
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

// Difficulty bar
function DifficultyBar({ value }: { value: number }) {
  const color = getDifficultyColor(value)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>{value}</span>
    </div>
  )
}

const brandNames: Record<string, string> = {
  T: "TechCorp",
  D: "DataFlow",
  C: "CloudBase",
  M: "MetaAI",
}

const promptsData = [
  {
    id: 1,
    prompt: "how to use react hooks",
    visibilityScore: 92,
    sentiment: 88,
    volume: 8900,
    difficulty: 45,
    brands: ["T", "D"],
  },
  {
    id: 2,
    prompt: "best practices for react performance optimization",
    visibilityScore: 87,
    sentiment: 92,
    volume: 12400,
    difficulty: 72,
    brands: ["T", "D", "C"],
  },
  {
    id: 3,
    prompt: "web development trends 2025",
    visibilityScore: 78,
    sentiment: 87,
    volume: 15600,
    difficulty: 61,
    brands: ["T", "D", "C"],
  },
  {
    id: 4,
    prompt: "implement error handling in javascript",
    visibilityScore: 74,
    sentiment: 85,
    volume: 5200,
    difficulty: 88,
    brands: ["T"],
  },
  {
    id: 5,
    prompt: "best ai tools for content creators",
    visibilityScore: 65,
    sentiment: 91,
    volume: 3800,
    difficulty: 34,
    brands: ["C", "M"],
  },
]

export function PromptsContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPrompts = promptsData.filter((item) =>
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <Button className="gap-2">
            <Plus className="size-4" />
            Create Prompt
          </Button>
          <Button variant="outline" className="gap-2">
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-9 bg-card border-border"
          />
        </div>
        <span className="shrink-0 text-sm text-muted-foreground">
          {filteredPrompts.length} prompts
        </span>
      </div>

      {/* Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pl-6">
                  Prompt
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1">
                    Visibility Score
                    <HelpTooltip title="Visibility Score">
                      Measures how often your brand appears in AI model responses for this prompt. Higher is better.
                    </HelpTooltip>
                  </span>
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Sentiment
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1">
                    Volume
                    <HelpTooltip title="Volume">
                      The estimated monthly search volume for this prompt across all AI platforms.
                    </HelpTooltip>
                  </span>
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1">
                    Difficulty
                    <HelpTooltip title="Difficulty">
                      How hard it is to improve your visibility for this prompt. Lower is easier.
                    </HelpTooltip>
                  </span>
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pr-6">
                  Brands
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrompts.map((item) => (
                <TableRow key={item.id} className="border-border">
                  <TableCell className="max-w-[300px] text-sm text-foreground pl-6">
                    {item.prompt}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: getScoreColor(item.visibilityScore) }}
                    >
                      {item.visibilityScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <SentimentBar value={item.sentiment} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm tabular-nums text-foreground">
                      {item.volume.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DifficultyBar value={item.difficulty} />
                  </TableCell>
                  <TableCell className="pr-6">
                    <TooltipProvider>
                      <div className="flex gap-1">
                        {item.brands.map((b) => (
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
    </div>
  )
}
