"use client"

import { ThemeToggle } from "./theme-toggle"
import { PeriodSelector } from "./period-selector"
import { useModelFilter } from "./model-filter-context"
import { MODEL_CONFIG, type ModelKey, isModelLocked, LOCKED_MODELS } from "@/lib/models"
import {
  ChatGPTLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  AIOverviewLogo,
  PerplexityLogo,
} from "./model-logos"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Sparkles, ChevronDown, Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const MODEL_LOGOS: Record<ModelKey, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
}

export function DashboardHeader() {
  const { activeModels, toggleModel, allModels } = useModelFilter()
  const [open, setOpen] = useState(false)
  const allActive = activeModels.size === allModels.length

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">DealerOn Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Global model filter — styled like PeriodSelector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 gap-2 px-3">
              <Sparkles className="size-4 text-muted-foreground" />
              <span>{allActive ? "All Models" : `${activeModels.size} Models`}</span>
              {!allActive && (
                <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {activeModels.size}/{allModels.length}
                </span>
              )}
              <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" sideOffset={6} className="w-72 p-5 shadow-xl">
            <p className="mb-1 text-sm font-semibold text-foreground">Which AI models to track?</p>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Toggle models on or off. Disabled models are hidden from all dashboard charts, cards, and tables.
            </p>

            <div className="flex flex-col gap-1">
              {allModels.map((key) => {
                const config = MODEL_CONFIG[key]
                const Logo = MODEL_LOGOS[key]
                const locked = isModelLocked(key)
                const checked = activeModels.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => !locked && toggleModel(key)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      locked
                        ? "cursor-default opacity-40"
                        : checked
                          ? "bg-secondary"
                          : "opacity-50 hover:opacity-75"
                    )}
                  >
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${config.hex}15`, color: config.hex }}
                    >
                      <Logo size={14} />
                    </span>
                    <span className="flex-1 text-left text-sm font-medium text-foreground">
                      {config.name}
                    </span>
                    {locked ? (
                      <Lock className="size-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <span
                        className="flex size-4.5 shrink-0 items-center justify-center rounded-md border transition-colors"
                        style={
                          checked
                            ? { backgroundColor: config.hex, borderColor: config.hex, color: "#fff" }
                            : { borderColor: "var(--border)" }
                        }
                      >
                        {checked && <Check className="size-2.5 stroke-[3]" />}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <Separator className="my-4" />

            {/* Upsell hint */}
            <div className="rounded-lg bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
              Tracking <strong className="text-foreground">{activeModels.size}</strong> models.{" "}
              Unlock {LOCKED_MODELS.map(k => MODEL_CONFIG[k].name).join(", ")} to track all {allModels.length}.{" "}
              <a href="#" className="text-primary hover:underline">Learn more</a>
            </div>
          </PopoverContent>
        </Popover>

        <PeriodSelector />
        <ThemeToggle />
      </div>
    </header>
  )
}
