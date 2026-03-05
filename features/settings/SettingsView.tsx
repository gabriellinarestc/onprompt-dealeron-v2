"use client"

import { Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import type { SettingsData } from "./types"
import type { SettingsEvents } from "./events"

function LoadingSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}

export type SettingsViewProps = {
  state: "loading" | "empty" | "error" | "ready"
  data?: SettingsData
  error?: { title: string; message: string; code?: string }
} & SettingsEvents

export function SettingsView({ state, data, error, onRetry }: SettingsViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage account and application settings
        </p>
      </div>

      {state === "loading" && <LoadingSkeleton />}

      {state === "empty" && (
        <Card className="border-border bg-card">
          <CardContent className="py-16">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Settings className="size-5" />
                </EmptyMedia>
                <EmptyTitle>No settings available</EmptyTitle>
                <EmptyDescription>
                  Settings will be available once your account is fully configured.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}

      {state === "error" && error && (
        <Card className="border-border bg-card">
          <CardContent className="py-16">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{error.title}</EmptyTitle>
                <EmptyDescription>{error.message}</EmptyDescription>
                {error.code && (
                  <p className="mt-1 text-xs text-muted-foreground">Code: {error.code}</p>
                )}
              </EmptyHeader>
              <Button variant="outline" className="gap-2 mt-4" onClick={onRetry}>
                <RefreshCw className="size-4" />
                Retry
              </Button>
            </Empty>
          </CardContent>
        </Card>
      )}

      {state === "ready" && data && (
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Settings className="size-5" />
                </EmptyMedia>
                <EmptyTitle>Settings - Coming Soon</EmptyTitle>
                <EmptyDescription>
                  This feature is awaiting design. Settings UI will be built here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
