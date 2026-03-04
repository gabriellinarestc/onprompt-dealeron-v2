"use client"

import { ThemeToggle } from "./theme-toggle"
import { PeriodSelector } from "./period-selector"
import { useModelFilter } from "./model-filter-context"
import { MODEL_CONFIG, type ModelKey } from "@/lib/models"
import {
  ChatGPTLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  PerplexityLogo,
} from "./model-logos"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Check } from "lucide-react"

const MODEL_LOGOS: Record<ModelKey, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  perplexity: PerplexityLogo,
}

export function DashboardHeader() {
  const { activeModels, toggleModel, allModels } = useModelFilter()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">DealerOn Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Global model filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs font-medium">
              <SlidersHorizontal className="size-3.5" />
              Models
              {activeModels.size < allModels.length && (
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {activeModels.size}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-2">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Filter AI Models
            </p>
            <div className="flex flex-col gap-0.5">
              {allModels.map((key) => {
                const config = MODEL_CONFIG[key]
                const Logo = MODEL_LOGOS[key]
                const checked = activeModels.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleModel(key)}
                    className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  >
                    <span
                      className="flex size-6 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${config.hex}18`, color: config.hex }}
                    >
                      <Logo size={13} />
                    </span>
                    <span className="flex-1 text-left text-xs font-medium text-foreground">
                      {config.name}
                    </span>
                    <span
                      className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors"
                      style={
                        checked
                          ? { backgroundColor: config.hex, borderColor: config.hex, color: "#fff" }
                          : { borderColor: "var(--border)" }
                      }
                    >
                      {checked && <Check className="size-2.5 stroke-[3]" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>

        <PeriodSelector />
        <ThemeToggle />
      </div>
    </header>
  )
}
