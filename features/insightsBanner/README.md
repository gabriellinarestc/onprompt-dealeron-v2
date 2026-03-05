# InsightsBanner Feature Package

## Overview
Static educational banner explaining Visibility and Content Coverage metrics. Dismissable by the user.

## Files
- `types.ts` - Widget state and prop types
- `events.ts` - Callback type definitions (onDismiss, onRetry)
- `mocks.ts` - Mock state (static content, no data needed)
- `InsightsBannerView.tsx` - Pure presentational component with loading/empty/error/ready states
- `InsightsBannerShell.tsx` - Mock wiring with dismiss state management

## Integration Notes
- Replace `import { InsightsBanner } from "@/components/dashboard/insights-banner"` with `import { InsightsBannerShell } from "@/features/insightsBanner/InsightsBannerShell"`
- The banner has no data dependencies -- it is purely static content
- `onDismiss` controls local visibility; in production this would persist the preference
- The `empty` state returns null (banner hidden)
