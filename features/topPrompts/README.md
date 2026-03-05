# TopPrompts Feature Package

## Overview
Table of the most frequent prompts where the brand appears in AI model responses, with visibility, sentiment bars, and brand badges.

## Files
- `types.ts` - PromptItem and view prop types
- `events.ts` - Callback type definitions
- `mocks.ts` - Mock prompt data (9 prompts) and brand name map
- `TopPromptsView.tsx` - Pure presentational table component
- `TopPromptsShell.tsx` - Wires mock data

## Integration Notes
- Replace `import { TopPrompts } from "@/components/dashboard/top-prompts"` with `import { TopPromptsShell } from "@/features/topPrompts/TopPromptsShell"`
- No model filter dependency -- this widget does not filter by active models
- Links to `/prompts` via "View All" button
