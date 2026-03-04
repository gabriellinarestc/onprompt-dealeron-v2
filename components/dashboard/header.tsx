"use client"

"use client"

import { ThemeToggle } from "./theme-toggle"
import { PeriodSelector } from "./period-selector"

export function DashboardHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">DealerOn Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <PeriodSelector />
        <ThemeToggle />
      </div>
    </header>
  )
}
