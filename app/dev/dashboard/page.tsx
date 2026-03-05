"use client"

import { useState } from "react"
import { ModelFilterProvider } from "@/components/dashboard/model-filter-context"
import { DashboardView } from "@/features/dashboard/DashboardView"
import type { WidgetState } from "@/features/dashboard/types"

const STATES: WidgetState[] = ["ready", "loading", "empty", "error"]

export default function DevDashboardPage() {
  const [globalState, setGlobalState] = useState<WidgetState>("ready")

  return (
    <ModelFilterProvider>
      <div className="h-screen overflow-y-auto bg-background">
        <div className="border-b border-border bg-card px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dev Preview
              </p>
              <h1 className="text-sm font-bold text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center gap-1">
              {STATES.map((s) => (
                <button
                  key={s}
                  onClick={() => setGlobalState(s)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    globalState === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl p-6">
          <DashboardView widgetState={globalState} />
        </div>
      </div>
    </ModelFilterProvider>
  )
}
