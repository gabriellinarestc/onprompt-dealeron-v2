# Prompts

## What this is
Full-page feature for tracking and analyzing AI model prompts that mention the user's brand. Includes a searchable, paginated table with visibility scores, sentiment analysis, volume, difficulty, and brand mentions.

## Dev preview
Route: `/dev/prompts`
States available: loading / empty / no-results / error / ready / stress

## Contract

### Data (types.ts)
UI view models only. Backend owns the mapping from service DTOs to these types.

### Events (events.ts)
| Callback | Signature | Description |
|---|---|---|
| onSearch | (query: string) => void | Search input changed |
| onCreate | () => void | Create Prompt button clicked |
| onExport | () => void | Export CSV button clicked |
| onPageChange | (page: number) => void | Pagination page changed |
| onPageSizeChange | (pageSize: number) => void | Results per page changed |
| onRowClick | (id: number) => void | Table row clicked |
| onRetry | () => void | Error retry button clicked |

## Presentational boundary
- URL/query param state: External
- Client-side filtering of loaded data: no (event-driven via onSearch)
- Toast/notifications: host app owns
- Form validation: N/A

## Design tokens used
All colors use token references. No raw hex/oklch values introduced.
Score color utility uses computed oklch from numeric value (existing pattern).

## Integration notes
- Replace `PromptsShell` with real data wiring
- `PromptItem.isAnalyzing` controls the skeleton state per row for newly created prompts
- `CreatePromptModal` is currently in `components/dashboard/` — consider promoting to `components/patterns/` if reused
- Pagination is fully externalized via `pageInfo` + `onPageChange`/`onPageSizeChange`
- CSV export logic lives in the Shell — integrating engineer should wire to their own export endpoint

## Known limitations
- Sort is not yet implemented (no onSortChange event)
- No bulk actions (select + delete/export multiple)
