# Project Skill Audit — UI_FEATURE_SKILL Readiness

**Date:** 2026-03-05
**Branch:** `feature/skill-test`
**Skill reference:** `skills/UI_FEATURE_SKILL.md`

---

## TL;DR

The project has a solid design system and a working UI shell, but **zero features are structured according to the skill**. Every feature is implemented as a monolithic, data-coupled component with no types, no events, no mocks, no UI states, and no dev preview routes. The gap is structural, not visual. The overhaul required is about reorganization and contract formalization, not a rewrite of the visual work.

---

## 1. What the Project Has (Assets Worth Keeping)

| Asset | Status | Notes |
|---|---|---|
| Design token system | ✅ Excellent | Full CSS variable set in `globals.css` — semantic tokens for color, radius, typography, components (badge, table, card, input, tooltip, dropdown) |
| shadcn/ui component library | ✅ Installed | `components/ui/` has ~40 primitives ready to use |
| lucide-react icons | ✅ Installed | Used consistently throughout |
| Tailwind CSS v4 | ✅ Configured | All tokens exposed via `@theme inline` |
| Dark mode support | ✅ Working | Full dark theme token set defined |
| `DashboardShell` | ✅ Reusable | Sidebar + header wrapper — genuine shared infrastructure |
| `Empty` / `EmptyHeader` / `EmptyMedia` | ✅ Reusable | Exists in `components/ui/empty.tsx` — perfect candidate for skill empty states |
| `HelpTooltip` | ✅ Reusable | Consistent pattern for column/section tooltips |
| `TruncatedText` | ✅ Reusable | Handles long-string edge cases correctly |
| Next.js App Router | ✅ Correct setup | `app/` directory routing, all pages use App Router |
| TypeScript | ✅ Strict | `typescript: 5.7.3`, types used throughout |
| Model filter context | ✅ Working | `ModelFilterContext` — global filter for AI model selection |

**Token gap flagged:** The design uses `text-orange-*` / `bg-orange-*` raw Tailwind values in several places (e.g., `content-gap-analysis.tsx` I created). There is no `--warning` or `--brand-accent` token mapped to orange in the design system. Orange is a key UI color (prompts, coverage indicators) but is not formalized as a token. **This needs to be addressed before the overhaul.**

---

## 2. Current Feature Inventory vs. Skill Criteria

### Feature: Dashboard (/)
**Component:** `app/page.tsx` + multiple `components/dashboard/*.tsx`

| Skill Requirement | Status | Gap |
|---|---|---|
| `FeatureView.tsx` (pure presentational) | ❌ Missing | All components mix mock data with presentation. Data arrays are defined inline. |
| `types.ts` (UI view models) | ❌ Missing | No typed data contracts. Data shapes are inlined or inferred. |
| `events.ts` (callback definitions) | ❌ Missing | No event contract. `ModelFilterContext` is accessed directly, not passed as props. |
| `mocks.ts` (realistic mock data) | ⚠️ Inline | Mock data exists but is hardcoded inside the component files themselves. |
| `FeatureShell.tsx` (mock wiring) | ❌ Missing | No separation between orchestration and presentation. |
| `README.md` (integration notes) | ❌ Missing | No documentation for dev integration. |
| Dev preview route `/dev/dashboard` | ❌ Missing | No preview route. |
| Loading state | ❌ Missing | No skeleton. Data assumed always present. |
| Empty state | ❌ Missing | No empty state rendered when data arrays are empty. |
| Error state | ❌ Missing | No error boundary or error prop. |
| Ready state | ⚠️ Partial | Only state that exists — renders with hardcoded data. |

---

### Feature: Prompts (/prompts)
**Component:** `components/dashboard/prompts-content.tsx`

| Skill Requirement | Status | Gap |
|---|---|---|
| `FeatureView.tsx` | ❌ Missing | `PromptsContent` mixes state, pagination logic, mock data, and presentation in one 580-line file. |
| `types.ts` | ⚠️ Inline | `PromptData` interface defined locally inside the component file — not exported, not portable. |
| `events.ts` | ❌ Missing | `onCreate`, `onExport`, `onSearch`, `onPageChange` are all internal handlers, not prop callbacks. |
| `mocks.ts` | ⚠️ Inline | `initialPromptsData` (15 items) is hardcoded in the component. Realistic data but not exportable. |
| `FeatureShell.tsx` | ❌ Missing | |
| `README.md` | ❌ Missing | |
| Dev preview route | ❌ Missing | |
| Loading state | ⚠️ Partial | `AnalyzingSkeleton` exists for individual rows but no full-page loading skeleton. |
| Empty state | ⚠️ Partial | No empty state — table just renders empty with no message when `filteredPrompts.length === 0`. |
| Error state | ❌ Missing | |
| Pagination | ⚠️ Internal | Pagination logic works but is internal state — not event-driven via `onPageChange` prop. |

---

### Feature: Content Gaps (/content-gaps)
**Component:** `app/content-gaps/page.tsx` + `components/dashboard/content-gap-analysis.tsx` (recently added)

| Skill Requirement | Status | Gap |
|---|---|---|
| `FeatureView.tsx` | ❌ Missing | `ContentGapAnalysis` is a monolith — mock data, state, and presentation all in one file. |
| `types.ts` | ❌ Missing | No type contracts. |
| `events.ts` | ❌ Missing | `onRowClick`, `onExport`, `onSearch`, `onPeriodChange` callbacks don't exist as props. |
| `mocks.ts` | ⚠️ Inline | Mock data arrays defined at top of component file. |
| `FeatureShell.tsx` | ❌ Missing | |
| `README.md` | ❌ Missing | |
| Dev preview route | ❌ Missing | |
| Loading state | ❌ Missing | |
| Empty state | ❌ Missing | |
| Error state | ❌ Missing | |
| No results after search | ❌ Missing | Search filter works but no "no results" message. |

---

### Feature: Brands (/brands)
**Component:** `app/brands/page.tsx`

| Skill Requirement | Status | Gap |
|---|---|---|
| All skill requirements | ❌ Not built | Page is a placeholder `Empty` component with "Work in progress" message. |

---

### Feature: Crawler Logs (/crawler-logs)
**Component:** `app/crawler-logs/page.tsx`

| Skill Requirement | Status | Gap |
|---|---|---|
| All skill requirements | ❌ Not built | Page is a placeholder `Empty` component with "Work in progress" message. |

---

### Feature: Visitor Analytics (/visitor-analytics)
**Component:** `app/visitor-analytics/page.tsx`

| Skill Requirement | Status | Gap |
|---|---|---|
| All skill requirements | ❌ Not built | Page is a placeholder `Empty` component with "Work in progress" message. |

---

### Feature: Settings (/settings)
**Component:** `app/settings/page.tsx`

| Skill Requirement | Status | Gap |
|---|---|---|
| All skill requirements | ❌ Not built | Placeholder — not inspected but assumed same pattern. |

---

## 3. Structural Gaps (Project-Wide)

### 3.1 No `features/` folder
The skill requires a `features/<featureName>/` folder per feature. Currently, all feature code lives in `components/dashboard/` — a flat, undifferentiated folder. There is no separation between:
- Feature-local components (should live in `features/`)
- Shared primitives (already in `components/ui/` — correct)
- Shared patterns (currently mixed into `components/dashboard/`)

**Required action:** Create `features/` at the project root. Each feature gets its own folder with the full skill package.

### 3.2 No dev preview routes
The skill requires `/dev/<featureName>` routes that run without a backend. No such routes exist. This is the primary handoff artifact for dev teams.

**Required action:** Create `app/dev/` directory with a page per feature, wired to mock data only.

### 3.3 Mock data is not isolated
Mock data is hardcoded inside component files. Devs reading the code cannot distinguish "this is real data" from "this is a mock." At integration time there is no clear replacement target.

**Required action:** Extract all mock data into `mocks.ts` files per feature.

### 3.4 No typed event contracts
Every action (search, paginate, create, export, row click) is handled internally. Dev teams have no documented surface to wire real data. There is no `events.ts` anywhere in the project.

**Required action:** Define `events.ts` per feature. Convert all internal handlers to prop callbacks in `FeatureView`.

### 3.5 Missing UI states
Only the "ready" state exists, and only with hardcoded mock data. Loading, empty, error, and "no results" states are missing or incomplete across all features.

**Required action:** Implement all 4 states per feature. Loading states must use skeletons that match the layout — not spinners.

### 3.6 Token gap: orange/accent color
The design uses orange prominently (coverage indicators, AI recommendation badges, donut chart stroke, left-border accents). This maps to Tailwind's `orange-400/500` but there is no corresponding CSS variable token in the design system.

The `--warning` token exists (`oklch(0.7 0.16 75)` light / `oklch(0.8 0.16 75)` dark) but it appears in the theme and is not yet wired as a Tailwind color in `@theme inline`.

**Required action:** Either formalize `--warning` as the orange/accent color and add it to `@theme inline` as `--color-warning`, or add a dedicated `--coverage-accent` token. All orange raw values in components must be replaced with the token.

---

## 4. What Stays, What Changes, What Gets Added

### Stays (no changes needed)
- `components/ui/` — all primitives kept as-is
- `components/dashboard/dashboard-shell.tsx` — shared infrastructure
- `components/dashboard/sidebar.tsx` — shared infrastructure
- `components/dashboard/header.tsx` — shared infrastructure
- `components/dashboard/model-filter-context.tsx` — shared state (will be passed as prop at feature boundary)
- `app/globals.css` — design tokens (with orange token addition)
- `lib/models.ts`, `lib/utils.ts` — utilities

### Promoted to `components/patterns/` (shared reusable patterns)
These currently live in `components/dashboard/` but are clearly cross-feature:
- `help-tooltip.tsx` → `components/patterns/help-tooltip.tsx`
- `truncated-text.tsx` → `components/patterns/truncated-text.tsx`
- `section-header.tsx` → `components/patterns/section-header.tsx`
- `period-selector.tsx` → `components/patterns/period-selector.tsx`

### Moved into feature packages
These are feature-local and should live under `features/`:
- `components/dashboard/prompts-content.tsx` → `features/prompts/` (refactored)
- `components/dashboard/content-gaps.tsx` → `features/dashboard/` (dashboard widget version)
- `components/dashboard/content-gap-analysis.tsx` → `features/contentGaps/` (refactored, this file I created)
- `components/dashboard/mentions-by-model.tsx` → `features/dashboard/`
- `components/dashboard/brand-comparison.tsx` → `features/dashboard/`
- `components/dashboard/brand-sentiment.tsx` → `features/dashboard/`
- `components/dashboard/top-prompts.tsx` → `features/dashboard/`
- `components/dashboard/visitor-analytics.tsx` → `features/dashboard/`
- `components/dashboard/top-pages-models.tsx` → `features/dashboard/`
- `components/dashboard/insights-banner.tsx` → `features/dashboard/`
- `components/dashboard/model-logos.tsx` → `features/dashboard/` or `components/patterns/`

### Gets added (new files per feature)
For each feature:
```
features/<featureName>/
  FeatureView.tsx     ← extracted, pure presentational
  FeatureShell.tsx    ← mock wiring only
  types.ts            ← UI view models
  events.ts           ← callback contracts
  mocks.ts            ← realistic / empty / stress / error datasets
  README.md           ← integration notes

app/dev/<featureName>/
  page.tsx            ← dev preview with state switcher
```

---

## 5. Overhaul Execution Plan

Work is ordered by dependency. Each phase is independent and can be executed as its own PR.

---

### Phase 0 — Foundation (do first, everything else depends on this)

**Goal:** Establish the correct project structure and fix the token gap before touching any feature.

**Tasks:**
1. Add `--color-warning` to `@theme inline` in `globals.css` (formalizes orange as a design token)
2. Create `features/` folder at project root
3. Create `components/patterns/` folder
4. Move shared patterns: `help-tooltip`, `truncated-text`, `section-header`, `period-selector` → `components/patterns/`
5. Update all existing imports to new paths
6. Create `app/dev/` directory with a placeholder index page

**Commit:** `feat(structure): establish features/ and components/patterns/ folders`

---

### Phase 1 — Prompts Feature (highest complexity, most complete)

**Goal:** Convert `PromptsContent` into a full skill-compliant feature package.

**Files to create:**
```
features/prompts/
  PromptsView.tsx     ← pure presentational, extracted from PromptsContent
  PromptsShell.tsx    ← wires mockRealistic to PromptsView
  types.ts            ← PromptItem, PromptsData, PageInfo
  events.ts           ← onSearch, onCreate, onExport, onPageChange, onPageSizeChange, onRowClick
  mocks.ts            ← mockRealistic (current 15 items), mockEmpty, mockStress (50 items), mockError
  README.md

app/dev/prompts/
  page.tsx            ← state switcher: loading / empty / error / ready
```

**UI states to add:**
- Loading: full-table skeleton (matching column widths)
- Empty (first time): "No prompts yet" + "Create Prompt" CTA → `onCreate`
- No results: "No prompts match your search" — different copy from empty
- Error: title + message + retry button → `onRetry`

**Token fix:** Replace any raw color values with tokens.

**Commit points:**
- `feat(ui): prompts — types, events, mocks`
- `feat(ui): prompts — PromptsView with all states`
- `feat(ui): prompts — dev preview page`

---

### Phase 2 — Content Gaps Feature

**Goal:** Convert `ContentGapAnalysis` into a full skill-compliant feature package. Supersedes the quick implementation done earlier.

**Files to create:**
```
features/contentGaps/
  ContentGapsView.tsx
  ContentGapsShell.tsx
  types.ts            ← ContentGapItem, CoverageStats, AIRecommendation, ContentGapsData
  events.ts           ← onRowClick, onExport, onSearch, onPeriodChange, onComparePeriodChange
  mocks.ts            ← mockRealistic, mockEmpty, mockStress, mockError
  README.md

app/dev/content-gaps/
  page.tsx
```

**UI states to add:**
- Loading: skeleton for donut chart, recommendation list, and table rows
- Empty: "No content gaps detected" with explanation
- No results after search: "No gaps match your search"
- Error: retry state

**Token fix:** Replace `bg-orange-400`, `text-orange-500`, etc. with `bg-warning`, `text-warning`.

**Cleanup:** Delete `components/dashboard/content-gap-analysis.tsx` (the improper quick implementation).

**Commit points:**
- `feat(ui): content-gaps — types, events, mocks`
- `feat(ui): content-gaps — ContentGapsView with all states`
- `feat(ui): content-gaps — dev preview page`

---

### Phase 3 — Dashboard Feature

**Goal:** Convert the main dashboard page components into a skill-compliant package.

The dashboard is a composition of multiple sub-components. Treat the entire dashboard page as one feature with sub-views.

**Files to create:**
```
features/dashboard/
  DashboardView.tsx         ← composes all sub-views
  DashboardShell.tsx        ← mock wiring
  types.ts                  ← BrandVisibilityData, MentionData, SentimentData, etc.
  events.ts                 ← onModelFilterChange, onPeriodChange, onViewContentGaps, etc.
  mocks.ts
  README.md
  subviews/
    MentionsByModelView.tsx
    BrandComparisonView.tsx
    BrandSentimentView.tsx
    TopPromptsView.tsx
    ContentGapsWidgetView.tsx
    VisitorAnalyticsView.tsx
    TopPagesModelsView.tsx
    InsightsBannerView.tsx

app/dev/dashboard/
  page.tsx
```

**UI states to add:**
- Loading skeletons for each card/section
- Empty state when no data exists
- Error state per section (individual section errors, not full-page error)

**Commit points:**
- `feat(ui): dashboard — types, events, mocks`
- `feat(ui): dashboard — all sub-views extracted`
- `feat(ui): dashboard — DashboardView composition and all states`
- `feat(ui): dashboard — dev preview page`

---

### Phase 4 — Brands Feature (new build)

**Goal:** Build the Brands feature from scratch following the skill.

**Pre-step:** Run the Feature Brief process (Step 1 of skill) — the UI is not yet designed. Do not build without design input.

**Files to create:**
```
features/brands/
  BrandsView.tsx
  BrandsShell.tsx
  types.ts
  events.ts
  mocks.ts
  README.md

app/dev/brands/
  page.tsx
```

---

### Phase 5 — Crawler Logs Feature (new build)

Same as Phase 4 — needs design before implementation.

```
features/crawlerLogs/
app/dev/crawler-logs/
```

---

### Phase 6 — Visitor Analytics Feature (new build)

Same as Phase 4 — needs design before implementation.

Note: `components/dashboard/visitor-analytics.tsx` exists as a dashboard widget — extract and promote during this phase.

```
features/visitorAnalytics/
app/dev/visitor-analytics/
```

---

### Phase 7 — Settings Feature (new build)

Same as Phase 4 — needs design before implementation.

```
features/settings/
app/dev/settings/
```

---

### Phase 8 — Cleanup & PR Package

1. Delete `components/dashboard/` (now empty after all extractions)
2. Verify no broken imports
3. Update `PROJECT_CONFIG.md` with finalized conventions
4. Add `/dev` index page listing all available preview routes
5. PR description per skill Step 8 template

---

## 6. Final Target Folder Structure

```
/
├── app/
│   ├── (routes)/           ← production pages, thin wrappers around FeatureShell
│   │   ├── page.tsx
│   │   ├── prompts/page.tsx
│   │   ├── content-gaps/page.tsx
│   │   ├── brands/page.tsx
│   │   ├── crawler-logs/page.tsx
│   │   ├── visitor-analytics/page.tsx
│   │   └── settings/page.tsx
│   └── dev/                ← dev preview routes, NO backend required
│       ├── page.tsx        ← index listing all features
│       ├── dashboard/page.tsx
│       ├── prompts/page.tsx
│       ├── content-gaps/page.tsx
│       ├── brands/page.tsx
│       ├── crawler-logs/page.tsx
│       ├── visitor-analytics/page.tsx
│       └── settings/page.tsx
│
├── features/               ← one folder per feature (skill packages)
│   ├── dashboard/
│   │   ├── DashboardView.tsx
│   │   ├── DashboardShell.tsx
│   │   ├── types.ts
│   │   ├── events.ts
│   │   ├── mocks.ts
│   │   ├── README.md
│   │   └── subviews/
│   ├── prompts/
│   │   ├── PromptsView.tsx
│   │   ├── PromptsShell.tsx
│   │   ├── types.ts
│   │   ├── events.ts
│   │   ├── mocks.ts
│   │   └── README.md
│   ├── contentGaps/
│   ├── brands/
│   ├── crawlerLogs/
│   ├── visitorAnalytics/
│   └── settings/
│
├── components/
│   ├── ui/                 ← shadcn/ui primitives (unchanged)
│   └── patterns/           ← promoted shared patterns
│       ├── help-tooltip.tsx
│       ├── truncated-text.tsx
│       ├── section-header.tsx
│       └── period-selector.tsx
│
├── lib/
├── hooks/
├── skills/
└── app/globals.css
```

---

## 7. Skill Compliance Scorecard (Current vs. Target)

| Criterion | Current | After Overhaul |
|---|---|---|
| `features/` folder structure | 0% | 100% |
| `FeatureView` (pure presentational) | 0% | 100% |
| `types.ts` per feature | 0% | 100% |
| `events.ts` per feature | 0% | 100% |
| `mocks.ts` per feature | 0% | 100% |
| `FeatureShell.tsx` per feature | 0% | 100% |
| `README.md` per feature | 0% | 100% |
| Dev preview routes (`/dev/*`) | 0% | 100% |
| Loading state (skeleton) | 5% | 100% |
| Empty state | 20% | 100% |
| Error state | 0% | 100% |
| "No results" state | 0% | 100% |
| Design token compliance (no raw values) | 80% | 100% |
| Orange token formalized | 0% | 100% |
| `components/patterns/` for shared patterns | 0% | 100% |
| PR-ready package per feature | 0% | 100% |

**Current overall readiness: ~8%**
**Post-overhaul readiness: 100%**

---

## 8. Questions to Resolve Before Starting

1. **Features folder location:** `features/` at project root (no `src/`) — confirm this is acceptable given the existing `app/`, `components/`, `lib/` structure.
2. **Orange token name:** Should it be `--warning` (already exists in CSS), `--accent-brand`, or something more specific like `--coverage`? This affects component naming downstream.
3. **Phases 4–7 (unbuilt features):** Do designs exist for Brands, Crawler Logs, Visitor Analytics, and Settings? These cannot be built without design input — should these phases be parked until designs are ready, or should we build placeholder shells that at least establish the skill structure?
4. **Dashboard decomposition:** The dashboard is one page but ~8 components. Should it be one feature package (`features/dashboard/`) with sub-views, or one package per widget? The former keeps it simpler; the latter gives each widget its own integration contract.
5. **Delete quick implementation:** Confirm it's OK to delete `components/dashboard/content-gap-analysis.tsx` and redo it properly in `features/contentGaps/`.
