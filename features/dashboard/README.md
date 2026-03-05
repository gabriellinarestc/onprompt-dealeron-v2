# Dashboard

## What this is
Composite feature that orchestrates all dashboard widgets into the main page layout. Each widget is an independent feature package under `features/`.

## Dev preview
Route: `/dev/dashboard`
States available: loading / empty / error / ready (applies to all widgets simultaneously)

## Sub-features
- `insightsBanner` — Key metrics banner
- `mentionsByModel` — Mentions breakdown by AI model
- `brandComparison` — Brand comparison table/chart
- `brandSentiment` — Sentiment analysis
- `topPrompts` — Top performing prompts widget
- `contentGapsWidget` — Content gaps overview widget
- `visitorAnalytics` — Visitor analytics chart
- `topPagesModels` — Top pages by AI model

## Contract
The dashboard itself has no data contract — it composes widget shells. Each widget owns its own types, events, and mocks.

## Integration notes
- Replace individual `*Shell` imports with real data-wired versions
- The `widgetState` prop on `DashboardView` is for dev preview only — in production, each widget manages its own loading state independently
- `SectionHeader` is a shared pattern from `components/patterns/`
