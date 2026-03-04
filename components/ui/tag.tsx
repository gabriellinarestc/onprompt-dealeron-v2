import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        low: "bg-primary/8 text-primary/70",
        moderate: "bg-primary/10 text-primary/75",
        medium: "bg-primary/12 text-primary/80",
        high: "bg-primary/15 text-primary/85",
        critical: "bg-primary/18 text-primary/90",
        success: "bg-emerald-500/10 text-emerald-600/80",
        warning: "bg-amber-500/10 text-amber-600/80",
        danger: "bg-red-500/10 text-red-600/80",
        info: "bg-blue-500/10 text-blue-600/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

function Tag({ className, variant, ...props }: TagProps) {
  return (
    <span
      data-slot="tag"
      className={cn(tagVariants({ variant }), className)}
      {...props}
    />
  )
}

// Difficulty-specific tag component for convenience
type DifficultyLevel = "Low" | "Moderate" | "Medium" | "High" | "Very High"

function getDifficultyLevel(value: number): DifficultyLevel {
  if (value <= 20) return "Low"
  if (value <= 40) return "Moderate"
  if (value <= 60) return "Medium"
  if (value <= 80) return "High"
  return "Very High"
}

function getDifficultyVariant(level: DifficultyLevel): TagProps["variant"] {
  switch (level) {
    case "Low":
      return "low"
    case "Moderate":
      return "moderate"
    case "Medium":
      return "medium"
    case "High":
      return "high"
    case "Very High":
      return "critical"
  }
}

interface DifficultyTagProps extends Omit<TagProps, "variant" | "children"> {
  value: number
}

function DifficultyTag({ value, className, ...props }: DifficultyTagProps) {
  const level = getDifficultyLevel(value)
  const variant = getDifficultyVariant(level)

  return (
    <Tag variant={variant} className={className} {...props}>
      {level}
    </Tag>
  )
}

export { Tag, tagVariants, DifficultyTag, getDifficultyLevel }
