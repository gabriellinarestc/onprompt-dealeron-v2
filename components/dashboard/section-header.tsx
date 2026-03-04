import { cn } from "@/lib/utils"
import { HelpTooltip } from "./help-tooltip"

export function SectionHeader({
  title,
  tooltip,
  className,
}: {
  title: string
  tooltip?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-1.5">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {title}
        </h2>
        {tooltip && (
          <HelpTooltip>{tooltip}</HelpTooltip>
        )}
      </div>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
