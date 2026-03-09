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
  /** Number of lines before truncating. Defaults to 1. */
  lines?: number
  tooltipIcon?: ReactNode
  tooltipSide?: "top" | "bottom" | "left" | "right"
}

export function TruncatedText({
  children,
  className = "",
  lines = 1,
  tooltipIcon,
  tooltipSide = "bottom",
}: TruncatedTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)
  const isMultiLine = lines > 1

  const checkTruncation = useCallback(() => {
    const el = textRef.current
    if (el) {
      setIsTruncated(
        isMultiLine
          ? el.scrollHeight > el.clientHeight
          : el.scrollWidth > el.clientWidth
      )
    }
  }, [isMultiLine])

  useEffect(() => {
    checkTruncation()
    const el = textRef.current
    if (!el) return
    const observer = new ResizeObserver(checkTruncation)
    observer.observe(el)
    return () => observer.disconnect()
  }, [checkTruncation, children])

  const clampClass = isMultiLine ? `line-clamp-${lines}` : "truncate"

  if (!isTruncated) {
    return (
      <p ref={textRef} className={`${clampClass} ${className}`}>
        {children}
      </p>
    )
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p ref={textRef} className={`${clampClass} cursor-default ${className}`}>
            {children}
          </p>
        </TooltipTrigger>
        <TooltipContent
          side={tooltipSide}
          className="block max-w-sm bg-popover text-popover-foreground border-border"
        >
          {tooltipIcon}
          <span className="text-xs font-medium">{children}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
