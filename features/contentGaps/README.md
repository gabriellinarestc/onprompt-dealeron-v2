# Content Gaps

## What this is
Full-page feature for identifying topics where the user's brand is missing from AI model responses. Includes a coverage donut chart, searchable/paginated table with priority levels, coverage status, and competitor analysis.

## Dev preview
Route: `/dev/content-gaps`
States available: loading / empty / no-results / error / ready / stress

## Contract

### Data (types.ts)
UI view models only. Backend owns the mapping from service DTOs to these types.

### Events (events.ts)
| Callback | Signature | Description |
|---|---|---|
| onSearch | (query: string) => void | Search input changed |
| onExport | () => void | Export CSV button clicked |
| onRowClick | (id: number) => void | Table row clicked |
| onPageChange | (page: number) => void | Pagination page changed |
| onPageSizeChange | (pageSize: number) => void | Results per page changed |
| onPriorityFilter | (priority: string \| null) => void | Priority filter changed |
| onRetry | () => void | Error retry button clicked |

## Presentational boundary
- URL/query param state: External
- Client-side filtering of loaded data: no (event-driven via onSearch)
- Toast/notifications: host app owns

## Design tokens used
All colors use token references. Coverage status colors use oklch computed values (existing project pattern). Priority badges use `--destructive` and `--warning` tokens.

## Integration notes
- Replace `ContentGapsShell` with real data wiring
- `CoverageStats` drives the donut chart — compute server-side
- Pagination is fully externalized via `pageInfo` + `onPageChange`/`onPageSizeChange`
- Each row shows a recommendation — consider expanding into a detail panel on `onRowClick`

## Known limitations
- Sort is not yet implemented (no onSortChange event)
- No bulk actions
- Priority filter event defined but not wired in the view yet
