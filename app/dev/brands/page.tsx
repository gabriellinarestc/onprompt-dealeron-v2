"use client"

import { useState } from "react"
import { BrandsView } from "@/features/brands/BrandsView"
import { mockRealistic, mockEmpty, mockError } from "@/features/brands/mocks"
import { Button } from "@/components/ui/button"

type ViewState = "loading" | "empty" | "error" | "ready"

const states: { label: string; value: ViewState }[] = [
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "Error", value: "error" },
  { label: "Ready", value: "ready" },
]

export default function BrandsDevPage() {
  const [activeState, setActiveState] = useState<ViewState>("ready")

  const data =
    activeState === "ready"
      ? mockRealistic
      : activeState === "empty"
      ? mockEmpty
      : undefined

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dev Preview
            </p>
            <h1 className="text-sm font-bold text-foreground">Brands</h1>
          </div>
          <div className="flex items-center gap-1">
            {states.map((s) => (
              <Button
                key={s.value}
                variant={activeState === s.value ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setActiveState(s.value)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl p-6">
        <BrandsView
          state={activeState}
          data={data}
          error={activeState === "error" ? mockError : undefined}
          onRetry={() => console.log("onRetry")}
        />
      </div>
    </div>
  )
}
