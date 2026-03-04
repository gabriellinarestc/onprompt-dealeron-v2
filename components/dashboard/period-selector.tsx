"use client"

import { useState } from "react"
import { CalendarDays, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const PERIODS = [7, 14, 30, 90] as const
type Period = (typeof PERIODS)[number]

export function PeriodSelector() {
  const [open, setOpen] = useState(false)
  const [days, setDays] = useState<Period>(7)
  const [compare, setCompare] = useState(true)

  const canCompare = days === 7

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 gap-2 px-3">
          <CalendarDays className="size-4 text-muted-foreground" />
          <span>Last {days} days</span>
          {compare && canCompare && (
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
              vs. prior 7d
            </span>
          )}
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={6} className="w-72 p-5 shadow-xl">

        {/* Period */}
        <p className="mb-1 text-sm font-semibold text-foreground">How much data do you want to see?</p>
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          Pick a time window. More days means more context, fewer days means more recent detail.
        </p>
        <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-border bg-muted p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setDays(p)}
              className={cn(
                "rounded-lg py-2 text-sm font-semibold transition-all",
                days === p
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}d
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {{
            7: "Past week",
            14: "Past two weeks",
            30: "Past month",
            90: "Past three months",
          }[days]}
        </p>

        <Separator className="my-4" />

        {/* Comparison */}
        <div className={cn("flex items-start justify-between gap-4", !canCompare && "opacity-50")}>
          <div>
            <p className="text-sm font-semibold text-foreground">Compare to prior 7 days</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {canCompare
                ? "Shows whether your numbers went up or down compared to the previous week."
                : "Only available when viewing 7-day data."}
            </p>
          </div>
          <Switch
            checked={compare && canCompare}
            onCheckedChange={setCompare}
            disabled={!canCompare}
            className="mt-0.5 shrink-0"
          />
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-lg bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          {compare && canCompare
            ? <>You are viewing the <strong className="text-foreground">last {days} days</strong>, compared against the <strong className="text-foreground">7 days before that</strong>.</>
            : <>You are viewing the <strong className="text-foreground">last {days} days</strong> with no comparison.</>}
        </div>
      </PopoverContent>
    </Popover>
  )
}
