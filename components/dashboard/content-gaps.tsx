"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HelpTooltip } from "./help-tooltip"

const recommendations = [
  {
    rank: 1,
    title: "Advanced TypeScript Patterns",
    description: "Create a comprehensive guide on Generic types in TypeScript",
    prompts: 3,
  },
  {
    rank: 2,
    title: "Python Async/Await Best Practices",
    description: "Create guide on async/await error handling strategies",
    prompts: 3,
  },
  {
    rank: 3,
    title: "Machine Learning Model Deployment",
    description: "Expand edge computing deployment scenarios",
    prompts: 3,
  },
]

export function ContentGaps() {
  return (
    <Card className="border-border bg-card h-full">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">Content Gaps Overview</h3>
          <HelpTooltip title="Content Gaps">
            Topics where users are asking AI models questions but your brand is not appearing in responses. Addressing these gaps can improve your visibility score.
          </HelpTooltip>
        </div>
        <Button variant="link" size="sm" asChild>
          <Link href="/content-gaps">
            View All
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <CardContent>
        <div className="mb-5 flex items-center gap-4 rounded-lg bg-secondary p-4">
          <div className="relative size-14">
            <svg className="rotate-[-90deg]" width={56} height={56}>
              <circle
                cx={28} cy={28} r={22}
                strokeWidth={5} fill="none"
                className="stroke-muted"
              />
              <circle
                cx={28} cy={28} r={22}
                strokeWidth={5} fill="none"
                strokeDasharray={138.23}
                strokeDashoffset={138.23 - (57 / 100) * 138.23}
                strokeLinecap="round"
                className="stroke-chart-3"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">57%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Content Coverage</p>
            <p className="text-xs text-muted-foreground">57% of tracked topics covered</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Top Recommendations
          </p>
          <div className="flex flex-col gap-2">
            {recommendations.map((item) => (
              <div
                key={item.rank}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                  {item.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary text-[10px]">
                  {item.prompts} prompts
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
