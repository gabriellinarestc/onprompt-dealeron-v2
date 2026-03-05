# ContentGapsWidget Feature Package

## Overview
Dashboard card showing content coverage percentage ring and top recommendations for improving AI visibility.

## Files
- `types.ts` - ContentRecommendation and view prop types
- `events.ts` - Callback type definitions
- `mocks.ts` - Mock coverage percentage and recommendations data
- `ContentGapsWidgetView.tsx` - Pure presentational component
- `ContentGapsWidgetShell.tsx` - Wires mock data

## Integration Notes
- Replace `import { ContentGaps } from "@/components/dashboard/content-gaps"` with `import { ContentGapsWidgetShell } from "@/features/contentGapsWidget/ContentGapsWidgetShell"`
- This is the dashboard CARD version, NOT the full content-gaps page at `app/content-gaps/`
- Links to `/content-gaps` via "View All" button
