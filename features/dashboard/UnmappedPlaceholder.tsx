"use client"

import { Building2, Mail } from "lucide-react"

export function UnmappedPlaceholder() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-7 w-7 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            No Dealership Connected
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your account isn&apos;t linked to a dealership project yet. Once connected, you&apos;ll see your AI brand visibility, sentiment data, and visitor analytics here.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-lg bg-muted/50 px-6 py-4">
          <p className="text-sm font-medium text-foreground">
            Need help getting set up?
          </p>
          <a
            href="mailto:support@onprompt.ai"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
