"use client"

import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HelpTooltipProps {
  title?: string
  children: React.ReactNode
}

export function HelpTooltip({ title, children }: HelpTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full text-muted-foreground/40 transition-colors hover:text-muted-foreground/70 focus-visible:outline-none"
            aria-label="More info"
          >
            <HelpCircle className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[260px] bg-popover text-popover-foreground border-border shadow-lg"
        >
          {title && (
            <p className="mb-1 text-[11px] font-semibold text-foreground">{title}</p>
          )}
          <div className="text-[11px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
