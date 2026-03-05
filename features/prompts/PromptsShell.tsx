"use client"

import { useState, useMemo, useCallback } from "react"
import { PromptsView } from "./PromptsView"
import { mockRealistic, brandNames } from "./mocks"
import { CreatePromptModal } from "@/components/dashboard/create-prompt-modal"
import type { PromptItem } from "./types"
import { getDifficultyLevel } from "@/components/ui/tag"

function formatVolumeRange(volume: number): string {
  if (volume < 1000) return "< 1K"
  if (volume < 5000) return "1K - 5K"
  if (volume < 10000) return "5K - 10K"
  if (volume < 25000) return "10K - 25K"
  if (volume < 50000) return "25K - 50K"
  if (volume < 100000) return "50K - 100K"
  return "100K+"
}

export function PromptsShell() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [prompts, setPrompts] = useState<PromptItem[]>(mockRealistic.items)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const filteredPrompts = useMemo(
    () =>
      prompts.filter((item) =>
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [prompts, searchQuery]
  )

  const totalItems = filteredPrompts.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedPrompts = filteredPrompts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const hasSearch = searchQuery.length > 0
  const isEmpty = prompts.length === 0
  const isNoResults = !isEmpty && filteredPrompts.length === 0

  const state = isEmpty
    ? "empty" as const
    : isNoResults
    ? "no-results" as const
    : "ready" as const

  const handleCreatePrompt = useCallback(
    (promptText: string) => {
      const newId = Math.max(...prompts.map((p) => p.id)) + 1
      const newPrompt: PromptItem = {
        id: newId,
        prompt: promptText,
        visibilityScore: null,
        sentiment: null,
        volume: null,
        difficulty: null,
        brands: [],
        isAnalyzing: true,
      }
      setPrompts((prev) => [newPrompt, ...prev])
      setCurrentPage(1)
    },
    [prompts]
  )

  const handleExportCSV = useCallback(() => {
    const exportablePrompts = prompts.filter((p) => !p.isAnalyzing)
    const headers = ["Prompt", "Visibility", "Sentiment", "Volume", "Difficulty", "Brands"]
    const rows = exportablePrompts.map((item) => [
      `"${item.prompt.replace(/"/g, '""')}"`,
      item.visibilityScore?.toString() ?? "",
      item.sentiment?.toString() ?? "",
      item.volume ? formatVolumeRange(item.volume) : "",
      item.difficulty ? getDifficultyLevel(item.difficulty) : "",
      item.brands.map((b) => brandNames[b] || b).join("; "),
    ])
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
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
    <>
      <PromptsView
        state={state}
        data={{ items: paginatedPrompts }}
        brandNames={brandNames}
        searchQuery={searchQuery}
        pageInfo={{
          page: currentPage,
          pageSize,
          totalItems,
          totalPages,
        }}
        onSearch={(q) => {
          setSearchQuery(q)
          setCurrentPage(1)
        }}
        onCreate={() => setIsCreateModalOpen(true)}
        onExport={handleExportCSV}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
        onRowClick={(id) => console.log("onRowClick", id)}
        onRetry={() => {}}
      />
      <CreatePromptModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreatePrompt}
      />
    </>
  )
}
