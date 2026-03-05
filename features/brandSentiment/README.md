# BrandSentiment Feature Package

## Overview
Two-card layout showing the current sentiment score summary and a temperature-colored area chart of sentiment over time.

## Files
- `types.ts` - SentimentDataPoint and view prop types
- `events.ts` - Callback type definitions
- `mocks.ts` - Mock sentiment time-series data (14 weekly points)
- `BrandSentimentView.tsx` - Pure presentational component with Recharts area chart
- `BrandSentimentShell.tsx` - Wires mock data and comparePrior from useModelFilter

## Integration Notes
- Replace `import { BrandSentiment } from "@/components/dashboard/brand-sentiment"` with `import { BrandSentimentShell } from "@/features/brandSentiment/BrandSentimentShell"`
- Uses Recharts (Area, AreaChart, etc.) -- ensure recharts is in dependencies
- The `comparePrior` flag controls whether the +8.9% change indicator is shown
