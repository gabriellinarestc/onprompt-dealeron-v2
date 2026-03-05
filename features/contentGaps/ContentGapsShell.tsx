"use client"

import { useState, useMemo } from "react"
import { ContentGapsView } from "./ContentGapsView"
import { mockRealistic } from "./mocks"
import type { ContentGapItem } from "./types"

export function ContentGapsShell() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const items = mockRealistic.items

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [items, searchQuery]
  )

  const totalItems = filteredItems.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const hasSearch = searchQuery.length > 0
  const isEmpty = items.length === 0
  const isNoResults = !isEmpty && filteredItems.length === 0

  const state = isEmpty
    ? ("empty" as const)
    : isNoResults
    ? ("no-results" as const)
    : ("ready" as const)

  return (
    <ContentGapsView
      state={state}
      data={{ items: paginatedItems, stats: mockRealistic.stats }}
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
      onExport={() => console.log("onExport")}
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size)
        setCurrentPage(1)
      }}
      onRowClick={(id) => console.log("onRowClick", id)}
      onRetry={() => {}}
    />
  )
}
