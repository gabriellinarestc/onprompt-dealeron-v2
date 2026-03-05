"use client"

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TruncatedTextProps {
  children: string
  className?: string
  tooltipIcon?: ReactNode
  tooltipSide?: "top" | "bottom" | "left" | "right"
}

export function TruncatedText({
  children,
  className = "",
  tooltipIcon,
  tooltipSide = "bottom",
}: TruncatedTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  const checkTruncation = useCallback(() => {
    const el = textRef.current
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth)
    }
  }, [])

  useEffect(() => {
    checkTruncation()
    const el = textRef.current
    if (!el) return
    const observer = new ResizeObserver(checkTruncation)
    observer.observe(el)
    return () => observer.disconnect()
  }, [checkTruncation, children])

  if (!isTruncated) {
    return (
      <p ref={textRef} className={`truncate ${className}`}>
        {children}
      </p>
    )
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p ref={textRef} className={`truncate cursor-default ${className}`}>
            {children}
          </p>
        </TooltipTrigger>
        <TooltipContent
          side={tooltipSide}
          className="flex items-center gap-2 bg-popover text-popover-foreground border-border"
        >
          {tooltipIcon}
          <span className="text-xs font-medium">{children}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
