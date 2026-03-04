import { cn } from "@/lib/utils"

export function SectionHeader({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
