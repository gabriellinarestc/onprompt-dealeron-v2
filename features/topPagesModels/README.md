# TopPagesModels Feature Package

## Overview
Side-by-side tables showing Top Pages (by AI traffic) and Top Models (by engagement), each with sortable Visitors and Crawls columns.

## Files
- `types.ts` - TopPageItem, TopModelItem, and view prop types
- `events.ts` - Callback type definitions
- `mocks.ts` - Mock top pages (5) and top models (6) data
- `TopPagesModelsView.tsx` - Pure presentational component with sortable tables
- `TopPagesModelsShell.tsx` - Wires mock data and filters models via useModelFilter

## Integration Notes
- Replace `import { TopPagesModels } from "@/components/dashboard/top-pages-models"` with `import { TopPagesModelsShell } from "@/features/topPagesModels/TopPagesModelsShell"`
- The Shell filters the models table using `resolveModelKey` + `isModelActive`
- Sorting state is kept inside the View (UI-only state, not data state)
- Links to `/visitor-analytics` and `/crawler-logs`
