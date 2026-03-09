export type WidgetState = "loading" | "empty" | "error" | "ready" | "unmapped"

export type DashboardData = {
  widgetState: WidgetState
}
