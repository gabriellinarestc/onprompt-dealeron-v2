"use client"

import { useState, useCallback, useMemo } from "react"
import { Plus, Download, Search, ChevronLeft, ChevronRight } from "lucide-react"
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
import { HelpTooltip } from "./help-tooltip"
import { CreatePromptModal } from "./create-prompt-modal"
import { DifficultyTag, getDifficultyLevel } from "@/components/ui/tag"

// Color utilities
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

// Volume range formatter
function formatVolumeRange(volume: number): string {
  if (volume < 1000) return "< 1K"
  if (volume < 5000) return "1K - 5K"
  if (volume < 10000) return "5K - 10K"
  if (volume < 25000) return "10K - 25K"
  if (volume < 50000) return "25K - 50K"
  if (volume < 100000) return "50K - 100K"
  return "100K+"
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

// Analyzing skeleton for loading state
function AnalyzingSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-12 animate-pulse rounded-full bg-muted" />
    </div>
  )
}

// Type for prompt data
interface PromptData {
  id: number
  prompt: string
  visibilityScore: number | null
  sentiment: number | null
  volume: number | null
  difficulty: number | null
  brands: string[]
  isAnalyzing: boolean
}

const brandNames: Record<string, string> = {
  T: "TechCorp",
  D: "DataFlow",
  C: "CloudBase",
  M: "MetaAI",
}

const initialPromptsData: PromptData[] = [
  {
    id: 1,
    prompt: "how to use react hooks",
    visibilityScore: 92,
    sentiment: 88,
    volume: 8900,
    difficulty: 45,
    brands: ["T", "D"],
    isAnalyzing: false,
  },
  {
    id: 2,
    prompt: "best practices for react performance optimization",
    visibilityScore: 87,
    sentiment: 92,
    volume: 12400,
    difficulty: 72,
    brands: ["T", "D", "C"],
    isAnalyzing: false,
  },
  {
    id: 3,
    prompt: "web development trends 2025",
    visibilityScore: 78,
    sentiment: 87,
    volume: 15600,
    difficulty: 61,
    brands: ["T", "D", "C"],
    isAnalyzing: false,
  },
  {
    id: 4,
    prompt: "implement error handling in javascript",
    visibilityScore: 74,
    sentiment: 85,
    volume: 5200,
    difficulty: 88,
    brands: ["T"],
    isAnalyzing: false,
  },
  {
    id: 5,
    prompt: "best ai tools for content creators",
    visibilityScore: 65,
    sentiment: 91,
    volume: 3800,
    difficulty: 34,
    brands: ["C", "M"],
    isAnalyzing: false,
  },
  {
    id: 6,
    prompt: "how to optimize database queries",
    visibilityScore: 81,
    sentiment: 79,
    volume: 6200,
    difficulty: 55,
    brands: ["D", "C"],
    isAnalyzing: false,
  },
  {
    id: 7,
    prompt: "best practices for API design",
    visibilityScore: 76,
    sentiment: 84,
    volume: 9100,
    difficulty: 48,
    brands: ["T", "D"],
    isAnalyzing: false,
  },
  {
    id: 8,
    prompt: "cloud computing fundamentals",
    visibilityScore: 69,
    sentiment: 88,
    volume: 22000,
    difficulty: 25,
    brands: ["C"],
    isAnalyzing: false,
  },
  {
    id: 9,
    prompt: "machine learning for beginners",
    visibilityScore: 72,
    sentiment: 90,
    volume: 45000,
    difficulty: 18,
    brands: ["M", "T"],
    isAnalyzing: false,
  },
  {
    id: 10,
    prompt: "cybersecurity best practices",
    visibilityScore: 84,
    sentiment: 76,
    volume: 31000,
    difficulty: 67,
    brands: ["T", "D", "C"],
    isAnalyzing: false,
  },
  {
    id: 11,
    prompt: "serverless architecture patterns",
    visibilityScore: 67,
    sentiment: 82,
    volume: 4800,
    difficulty: 73,
    brands: ["C"],
    isAnalyzing: false,
  },
  {
    id: 12,
    prompt: "kubernetes deployment strategies",
    visibilityScore: 58,
    sentiment: 78,
    volume: 7300,
    difficulty: 85,
    brands: ["D", "C"],
    isAnalyzing: false,
  },
]

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50] as const
type ResultsPerPage = (typeof RESULTS_PER_PAGE_OPTIONS)[number]

export function PromptsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [prompts, setPrompts] = useState<PromptData[]>(initialPromptsData)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState<ResultsPerPage>(50)

  const handleCreatePrompt = useCallback((promptText: string) => {
    const newId = Math.max(...prompts.map(p => p.id)) + 1
    
    // Add new prompt with analyzing state
    const newPrompt: PromptData = {
      id: newId,
      prompt: promptText,
      visibilityScore: null,
      sentiment: null,
      volume: null,
      difficulty: null,
      brands: [],
      isAnalyzing: true,
    }
    
    setPrompts(prev => [newPrompt, ...prev])
    setCurrentPage(1) // Reset to first page when adding new prompt
  }, [prompts])

  const filteredPrompts = useMemo(() => 
    prompts.filter((item) =>
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    ), [prompts, searchQuery]
  )

  // Pagination calculations
  const totalPrompts = filteredPrompts.length
  const totalPages = Math.ceil(totalPrompts / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = Math.min(startIndex + resultsPerPage, totalPrompts)
  const paginatedPrompts = filteredPrompts.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  // Handle results per page change
  const handleResultsPerPageChange = useCallback((value: string) => {
    setResultsPerPage(Number(value) as ResultsPerPage)
    setCurrentPage(1)
  }, [])

  const handleExportCSV = useCallback(() => {
    // Filter out prompts still being analyzed
    const exportablePrompts = prompts.filter(p => !p.isAnalyzing)
    
    // CSV headers
    const headers = ["Prompt", "Visibility", "Sentiment", "Volume", "Difficulty", "Brands"]
    
    // Convert prompts to CSV rows
    const rows = exportablePrompts.map(item => [
      `"${item.prompt.replace(/"/g, '""')}"`, // Escape quotes in prompt text
      item.visibilityScore?.toString() ?? "",
      item.sentiment?.toString() ?? "",
      item.volume ? formatVolumeRange(item.volume) : "",
      item.difficulty ? getDifficultyLevel(item.difficulty) : "",
      item.brands.map(b => brandNames[b] || b).join("; ")
    ])
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `prompts-export-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [prompts])

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
          <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="size-4" />
            Create Prompt
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search Bar and Prompt Count */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by prompt text..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 pl-9 bg-card border-border"
          />
        </div>
        <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
          {totalPrompts} {totalPrompts === 1 ? "prompt" : "prompts"}
        </Badge>
      </div>

      {/* Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pl-6 h-auto py-2">
                  Prompt
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium h-auto py-2">
                  <span className="inline-flex items-center gap-1">
                    Visibility
                    <HelpTooltip title="Visibility">
                      Measures how often your brand appears in AI model responses for this prompt. Higher is better.
                    </HelpTooltip>
                  </span>
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium h-auto py-2">
                  Sentiment
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium h-auto py-2">
                  <span className="inline-flex items-center gap-1">
                    Volume
                    <HelpTooltip title="Volume">
                      The estimated monthly search volume range for this prompt across all AI platforms.
                    </HelpTooltip>
                  </span>
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium h-auto py-2">
                  <span className="inline-flex items-center gap-1">
                    Difficulty
                    <HelpTooltip title="Difficulty">
                      How hard it is to improve your visibility for this prompt. Lower is easier.
                    </HelpTooltip>
                  </span>
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pr-6 h-auto py-2">
                  Brands
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPrompts.map((item) => (
                <TableRow key={item.id} className={`border-border ${item.isAnalyzing ? 'bg-muted/30' : ''}`}>
                  <TableCell className="max-w-[300px] text-sm text-foreground pl-6">
                    <div className="flex items-center gap-2">
                      {item.prompt}
                      {item.isAnalyzing && (
                        <span className="text-xs text-muted-foreground italic">Analyzing — this can take up to 24 hours.</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.isAnalyzing ? (
                      <AnalyzingSkeleton />
                    ) : (
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: getScoreColor(item.visibilityScore!) }}
                      >
                        {item.visibilityScore}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isAnalyzing ? (
                      <AnalyzingSkeleton />
                    ) : (
                      <SentimentBar value={item.sentiment!} />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isAnalyzing ? (
                      <AnalyzingSkeleton />
                    ) : (
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {formatVolumeRange(item.volume!)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isAnalyzing ? (
                      <AnalyzingSkeleton />
                    ) : (
                      <DifficultyTag value={item.difficulty!} />
                    )}
                  </TableCell>
                  <TableCell className="pr-6">
                    {item.isAnalyzing ? (
                      <AnalyzingSkeleton />
                    ) : (
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
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select value={String(resultsPerPage)} onValueChange={handleResultsPerPageChange}>
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
                  {startIndex + 1}-{endIndex} of {totalPrompts}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="size-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
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

      {/* Create Prompt Modal */}
      <CreatePromptModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreatePrompt}
      />
    </div>
  )
}
