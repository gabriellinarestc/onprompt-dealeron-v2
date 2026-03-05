# MentionsByModel Feature Package

## Overview
Displays the visibility/content-coverage score rings and per-model mention counts with growth percentages.

## Files
- `types.ts` - ScoreCardItem, ModelMentionItem, and view prop types
- `events.ts` - Callback type definitions
- `mocks.ts` - Mock scores and model mention data extracted from the original component
- `MentionsByModelView.tsx` - Pure presentational component (loading/empty/error/ready)
- `MentionsByModelShell.tsx` - Wires mock data and filters via useModelFilter

## Integration Notes
- Replace `import { MentionsByModel } from "@/components/dashboard/mentions-by-model"` with `import { MentionsByModelShell } from "@/features/mentionsByModel/MentionsByModelShell"`
- The Shell reads `useModelFilter()` and passes filtered model data as props
- Model logos imported from shared `@/components/dashboard/model-logos`
- Model config imported from shared `@/lib/models`
