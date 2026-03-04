"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowRight } from "lucide-react"

const brandNames: Record<string, string> = {
  T: "TechCorp",
  D: "DataFlow",
  C: "CloudBase",
  M: "MetaAI",
}

const promptsData = [
  {
    prompt: "best practices for react performance optimization",
    sentiment: 92,
    visibility: "87%",
    brands: ["T", "D", "C"],
  },
  {
    prompt: "how to use react hooks effectively",
    sentiment: 88,
    visibility: "92%",
    brands: ["T", "D"],
  },
  {
    prompt: "implement error handling in javascript applications",
    sentiment: 85,
    visibility: "74%",
    brands: ["T"],
  },
  {
    prompt: "best ai tools for content creators",
    sentiment: 92,
    visibility: "65%",
    brands: ["C", "M"],
  },
  {
    prompt: "web development trends 2025",
    sentiment: 92,
    visibility: "78%",
    brands: ["T", "D", "C"],
  },
  {
    prompt: "how to build scalable node.js applications",
    sentiment: 79,
    visibility: "81%",
    brands: ["T", "D"],
  },
  {
    prompt: "typescript best practices for large codebases",
    sentiment: 94,
    visibility: "89%",
    brands: ["T", "C"],
  },
  {
    prompt: "serverless architecture benefits and drawbacks",
    sentiment: 76,
    visibility: "62%",
    brands: ["D", "M"],
  },
  {
    prompt: "next.js vs remix comparison 2025",
    sentiment: 83,
    visibility: "71%",
    brands: ["T", "D", "C"],
  },
]

function SentimentBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-16 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  )
}

export function TopPrompts() {
  return (
    <Card className="border-border bg-card h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">Top Prompts</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-foreground hover:text-foreground" asChild>
            <Link href="/prompts">
              View All
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Table className="flex-1">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Prompt
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Sentiment
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Visibility
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Brands
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promptsData.map((item) => (
              <TableRow key={item.prompt} className="border-border">
                <TableCell className="max-w-[250px] truncate text-xs text-foreground">
                  {item.prompt}
                </TableCell>
                <TableCell>
                  <SentimentBar value={item.sentiment} />
                </TableCell>
                <TableCell className="text-xs font-medium text-success">
                  {item.visibility}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex gap-1">
                      {item.brands.map((b) => (
                        <Tooltip key={b}>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="size-5 items-center justify-center rounded-full border-border p-0 text-[10px] text-muted-foreground cursor-pointer"
                            >
                              {b}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="text-xs">{brandNames[b]}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
