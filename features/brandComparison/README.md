# BrandComparison Feature Package

## Overview
Displays a ranked list of brands with per-model mention breakdowns, visibility scores, and proportional stacked bars.

## Files
- `types.ts` - BrandEntry, BrandType, and view prop types
- `events.ts` - Callback type definitions
- `mocks.ts` - Mock brand comparison data (7 brands)
- `BrandComparisonView.tsx` - Pure presentational list view with loading/empty/error/ready states
- `BrandComparisonShell.tsx` - Wires mock data and activeModels from useModelFilter

## Integration Notes
- Replace `import { BrandComparison } from "@/components/dashboard/brand-comparison"` with `import { BrandComparisonShell } from "@/features/brandComparison/BrandComparisonShell"`
- The chart view (Recharts BarChart) from the original component was hidden behind a toggle for MVP; only the list view is rendered
- The Shell reads `activeModels` from the model filter context and passes it as a prop
