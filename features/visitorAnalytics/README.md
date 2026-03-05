# VisitorAnalytics Feature Package

## Overview
Two-panel widget showing Pages Crawled stats (indexed/blocked/pending) and Visitors by Model with growth percentages.

## Files
- `types.ts` - VisitorModelItem, CrawlerStatItem, and view prop types
- `events.ts` - Callback type definitions
- `mocks.ts` - Mock visitor model data and crawler stats
- `VisitorAnalyticsView.tsx` - Pure presentational component
- `VisitorAnalyticsShell.tsx` - Wires mock data with model filter

## Integration Notes
- Replace `import { VisitorAnalytics } from "@/components/dashboard/visitor-analytics"` with `import { VisitorAnalyticsShell } from "@/features/visitorAnalytics/VisitorAnalyticsShell"`
- The Shell filters visitor models using `isModelActive` from the model filter context
- Model logos imported from shared `@/components/dashboard/model-logos`
