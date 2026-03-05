"use client"

// ThemeToggle hidden for MVP - can be re-enabled later
// import { ThemeToggle } from "./theme-toggle"
import { PeriodSelector } from "@/components/patterns/period-selector"
import { useModelFilter } from "./model-filter-context"
import { MODEL_CONFIG, type ModelKey } from "@/lib/models"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Sparkles, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { usePathname } from "next/navigation"

const MODEL_LOGOS: Record<ModelKey, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
}

const FILTER_ENABLED_ROUTES = ["/"]
const FILTER_HIDDEN_ROUTES = ["/prompts"]

export function DashboardHeader() {
  const { activeModels, toggleModel, allModels } = useModelFilter()
  const [open, setOpen] = useState(false)
  const allActive = activeModels.size === allModels.length
  const pathname = usePathname()
  const filtersApply = FILTER_ENABLED_ROUTES.includes(pathname)
  const filtersHidden = FILTER_HIDDEN_ROUTES.includes(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">DealerOn Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        {filtersHidden ? null : filtersApply ? (
          <>
            {/* Global model filter */}
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
                    const checked = activeModels.has(key)
                    return (
                      <button
                        key={key}
                        onClick={() => toggleModel(key)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          checked ? "bg-secondary" : "opacity-50 hover:opacity-75"
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
                      </button>
                    )
                  })}
                </div>

                <Separator className="my-4" />

                <div className="rounded-lg bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                  Tracking <strong className="text-foreground">{activeModels.size} of {allModels.length}</strong> AI models across all dashboard sections.
                </div>
              </PopoverContent>
            </Popover>

            <PeriodSelector />
          </>
        ) : (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-default opacity-40">
                  <Button variant="outline" className="h-9 gap-2 px-3 pointer-events-none" tabIndex={-1}>
                    <Sparkles className="size-4 text-muted-foreground" />
                    <span>{allActive ? "All Models" : `${activeModels.size} Models`}</span>
                    {!allActive && (
                      <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                        {activeModels.size}/{allModels.length}
                      </span>
                    )}
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                  <div className="pointer-events-none">
                    <PeriodSelector />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                These filters don{"'"}t apply to this page
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {/* ThemeToggle hidden for MVP - can be re-enabled later */}
        {/* <ThemeToggle /> */}
      </div>
    </header>
  )
}
