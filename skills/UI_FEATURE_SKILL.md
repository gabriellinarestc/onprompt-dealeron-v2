# UI Feature Skill — Integration-Ready UI from Design to Dev

## When to use this skill

Use this skill when a **designer is kicking off a new feature or project** and the goal is to produce clean, presentational UI that a dev team can pick up and wire to real services — without throwaway work.

This skill produces:
- Production-grade presentational components
- All required UI states (loading, empty, error, ready)
- Typed contracts (props, events, view models)
- Realistic mocks
- A dev preview route
- A PR-ready package with integration notes

**Scope:** No backend logic. No data fetching. No services. Dev team owns integration.

### What ships to production vs. what doesn't

| File | Role | Destiny |
|---|---|---|
| `FeatureView.tsx` | Pure presentational component | ✅ **Production — keep** |
| `types.ts` | UI view models / data contracts | ✅ **Production — keep** |
| `events.ts` | Callback type definitions | ✅ **Production — keep** |
| `FeatureShell.tsx` | Mock data wiring + state orchestration | 🔄 **Dev scaffold — replaced at integration** |
| `mocks.ts` | Fake data for preview and dev | 🗑 **Dev scaffold — not imported in production** |
| `src/app/dev/<featureName>/page.tsx` | Preview harness | 🗑 **Dev scaffold — removed or gated before production** |

The dev team keeps the top three and replaces or removes the rest. The designer's real contribution is `FeatureView`, `types`, and `events` — everything else exists to make those reviewable without a backend.

---

## Step 0 — Before Writing Any Code

### 0.1 Run the Project Setup Questionnaire

Ask the user to confirm the following before proceeding. Do not assume defaults silently.

| Question | Options |
|---|---|
| Framework & routing | Next.js App Router / Pages Router / Vite React / Other |
| TypeScript required? | Yes / No |
| Styling system | Tailwind / CSS Modules / Styled Components / Other |
| Design tokens present? | Yes — see 0.2 / No — use sensible defaults |
| Component library | shadcn/ui / Radix / MUI / Chakra / None |
| Icons | lucide-react / heroicons / custom SVG / other |
| Dev preview base path | `/dev/<featureName>` or other |
| Features folder | `src/features/` or other |
| Shared components folder | `src/components/` or other |
| Animation policy | None / micro only / Framer Motion / CSS only |
| New or existing project? | New / Existing |

**Also ask:**

> Do you have an existing design system?
> If yes, please share it in one of these ways:
> - Paste your `tailwind.config.ts` or token file directly
> - Share a Figma link or token export (JSON, CSS variables, or style-dictionary format)
> - Paste relevant CSS custom properties or a design token reference
> - Describe your token naming convention if the file is not shareable
>
> The design system will be used as the source of truth for all visual decisions in this feature.

**Output a `PROJECT_CONFIG.md` summary before generating any code. Wait for confirmation before proceeding.**

Example `PROJECT_CONFIG.md`:
```
Framework: Next.js App Router
TypeScript: Yes
Styling: Tailwind (tokens in tailwind.config.ts — provided)
Component library: shadcn/ui (already installed)
Icons: lucide-react
Dev preview path: /dev/<featureName>
Features folder: src/features/
Shared components: src/components/ui/ + src/components/patterns/
Animation: micro only (CSS/Tailwind)
Project type: New
Design system: Tailwind config provided — tokens mapped below
  Colors: primary, secondary, muted, destructive, border, background, foreground
  Radii: sm, md, lg
  Typography: heading (font-display), body (font-sans), mono (font-mono)
```

If a design system was provided, extract and document the exact token names that will be used before writing any component code.

---

### 0.2 Design Token Rules

- **Tokens provided:** use them exclusively. Never use raw hex, hardcoded spacing, or font values. Reference token names as defined in the provided config.
- **Tokens exist but were not provided:** ask for them. Do not proceed with raw values.
- **No tokens exist (new project):** define a minimal token set in `tailwind.config.ts` before writing any components. Document every token name introduced. The feature README must list these so the team can adopt or replace them.
- **Token gap:** if a required token is missing from the provided system, flag it explicitly in the README rather than silently using a raw value. Propose the token name and value for team review.

---

### 0.3 Existing Project — Inspect Before Acting

If working inside an existing project, before writing any code:

1. Inspect folder structure and naming conventions
2. Identify existing design tokens, component patterns, import style
3. Identify which components are shared vs. feature-local
4. Follow established conventions exactly — consistency beats theoretical best practice

**Never:**
- Introduce a parallel architecture
- Rename or restructure established patterns
- Switch styling systems
- Add dependencies without approval
- Modify shared or design system components without explicit approval

When unclear → ask before implementing.

---

### 0.4 Git Workflow (Mandatory for Every Feature)

Every new feature starts from a clean branch off the base branch. No exceptions.

**Run the following sequence before writing any code.**

#### 1. Identify the base branch

Do not assume `main`. Inspect the repo first:

```bash
git remote show origin
```

Look for the line:
```
HEAD branch: <branch-name>
```

That is the base branch. Common names are `main`, `master`, `develop`, `trunk`. Use whatever the repo reports — never assume.

If `git remote show origin` returns nothing (no remote configured), fall back to:

```bash
git branch -a
```

Identify the most likely base branch from the list (usually the one named `main`, `master`, or `develop`, or the one with the most recent activity).

If still ambiguous after both checks, **stop and ask** which branch to base off. Do not guess.

#### 2. Pull latest and create the feature branch

Once the base branch is confirmed:

```bash
git checkout <base-branch>
git pull origin <base-branch>
git checkout -b feature/ui-<feature-name>
```

> **Naming rule:** `feature/ui-<feature-name>` where `<feature-name>` matches the `<featureName>` used throughout the package (file paths, routes, PR title). Use kebab-case for branch names (e.g., `feature/ui-invoice-list`) and camelCase for folder/file paths (e.g., `src/features/invoiceList/`).

#### 3. Confirm before proceeding

Output a confirmation and wait for acknowledgement before writing any code:

```
Base branch detected: <base-branch> (pulled latest)
Feature branch created: feature/ui-<feature-name>
All changes will be committed to this branch only.
```

#### During development

- All commits go to the feature branch only. **Never commit to the base branch.**
- Commit at meaningful milestones — not after every file, not in one giant commit at the end.

Suggested commit points:
- After `PROJECT_CONFIG.md` and Feature Brief are confirmed
- After types, events, and mocks are defined
- After each UI state is implemented (loading, empty, error, ready)
- After the dev preview page is working
- Final cleanup commit before PR

Commit message format:
```
feat(ui): <feature-name> — <what changed>

Examples:
feat(ui): invoice-list — add types, events, mocks
feat(ui): invoice-list — implement loading and empty states
feat(ui): invoice-list — implement ready state with pagination
feat(ui): invoice-list — add dev preview page
feat(ui): invoice-list — final cleanup, README added
```

#### Never
- Push directly to the base branch
- Merge the feature branch yourself — the PR is the handoff, merging is the dev team's responsibility
- Rebase or force-push without confirming with the team
- Commit unrelated changes (config changes, dependency bumps, unrelated fixes) to the feature branch

#### At completion

```bash
git push origin feature/ui-<feature-name>
```

Then provide the designer with the PR description (Step 8) ready to paste into GitHub.

---

## Step 1 — Write the Feature Brief

Before generating any files, produce a Feature Brief and wait for approval.

```markdown
# Feature Brief

## Feature Name
<featureName>

## Goal
What the user is trying to accomplish.

## UI Surface
- page/route:
- component entry:

## Content Type
- list / table / feed? yes / no
- cards? yes / no
- forms? yes / no

## Key Actions
- primary action:
- secondary action:
- row actions (if list):

## Required UI States
- loading: yes
- empty: yes
- no results after search/filter: yes / no
- error: yes
- ready/success: yes
- pagination: yes / no

## Presentational Boundary Decisions
- URL/query param state: UI-owned / External / N/A
- Client-side filtering of loaded data: yes / no (event-driven only)
- Toast/notification: UI triggers / host app owns / N/A
- Form validation: client-side only / none / N/A

## Constraints / Notes
- must reuse existing components:
- styling constraints:
- no new dependencies: yes
- special edge cases:
```

**Wait for approval before generating any code.**

---

## Step 2 — Generate the Feature Package

### File Structure

```
src/features/<featureName>/
  FeatureView.tsx       ← pure presentational, props-driven
  FeatureShell.tsx      ← UI state orchestration + mock data wiring only
  types.ts              ← UI view models (not backend DTOs)
  events.ts             ← all callbacks and events
  mocks.ts              ← realistic + empty + stress + error datasets
  README.md             ← integration notes for the dev team

src/app/dev/<featureName>/
  page.tsx              ← dev preview route, no backend required
```

> **Note on path casing:** use camelCase for `<featureName>` in folder/file paths (e.g., `invoiceList`), and kebab-case for URL paths and branch names (e.g., `/dev/invoice-list`, `feature/ui-invoice-list`).

Shared/promoted components (only if clearly reusable — see Step 6):
```
src/components/ui/        ← primitives (Badge, EmptyState, etc.)
src/components/patterns/  ← reusable UI patterns (PaginationControls, etc.)
```

---

### FeatureView Contract

`FeatureView.tsx` must accept:

```typescript
type FeatureViewProps = {
  state: "loading" | "empty" | "error" | "ready";
  data?: FeatureData;                            // from types.ts
  error?: { title: string; message: string; code?: string };
  pageInfo?: {                                   // only if paginated
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
} & FeatureEvents;                               // spread from events.ts
```

`FeatureView` must be **purely presentational**:
- No data fetching
- No service calls
- No global store access
- No server actions
- Everything received through props

---

### FeatureShell

`FeatureShell.tsx` handles UI state orchestration only:
- Imports mock data from `mocks.ts`
- Wires mock data to `FeatureView` for development and preview
- Contains no business logic, no services, no fetching
- **Is replaced by the integrating engineer with real data wiring at integration time**

```typescript
// FeatureShell is a thin orchestration wrapper — not business logic.
// The dev team replaces mock wiring with real service calls at integration.
export function FeatureShell() {
  return (
    <FeatureView
      state="ready"
      data={mockRealistic}
      onRetry={() => {}}
      onCreate={() => {}}
    />
  );
}
```

---

### events.ts — Callback Naming Convention

All callbacks follow the `on` prefix:

```typescript
export type FeatureEvents = {
  onRetry?: () => void;
  onRefresh?: () => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearch?: (query: string) => void;
  onSortChange?: (field: string, direction: "asc" | "desc") => void;
  onFilterChange?: (filters: FilterMap) => void;
  // feature-specific actions:
  onCreate?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};
```

Naming rules:
- `on` prefix always — never `handle`, never bare verbs
- Boolean props: `is` / `has` prefix (`isDisabled`, `hasError`, `isLoading`)
- Event signatures should pass IDs, not full objects, where possible

---

### types.ts — UI View Models

```typescript
// UI view models only — not backend DTOs.
// Backend integration owns: DTO → view model mapping.

export type FeatureItem = {
  id: string;
  // UI-facing fields only
};

export type FeatureData = {
  items: FeatureItem[];
  // top-level shape as needed
};
```

---

### mocks.ts — Mock Data Quality Standard

Mocks must look like **real product data**, not placeholder text. The dev preview is the handoff artifact — it must be convincing.

Rules:
- No "User Name", "Item 1", "Lorem ipsum", "Example Corp"
- Use plausible, domain-appropriate names, dates, statuses, and copy
- `mockRealistic`: 3–8 items, typical happy-path data
- `mockEmpty`: empty arrays and zero counts — triggers the empty state
- `mockStress`: 20–50 items, long strings, missing optional fields, edge case values
- `mockError`: realistic error shape matching the `error` prop type

```typescript
export const mockRealistic: FeatureData = { /* domain-appropriate data */ };
export const mockEmpty: FeatureData = { items: [] };
export const mockStress: FeatureData = { /* long names, nulls, high volumes */ };

// matches: { title: string; message: string; code?: string }
export const mockError = {
  title: "Failed to load",
  message: "Something went wrong. Please try again.",
  code: "ERR_500"
};
```

---

## Step 3 — UI States (All Required)

Every feature must implement all states. The dev preview must make each state accessible without touching code.

### Loading
- Skeletons that match the final layout — no spinner-only loading
- No layout shift between loading → ready
- Skeleton density must reflect actual content density

### Empty
- Clear explanation of what's missing
- Primary CTA wired to a callback (e.g. `onCreate`)
- Optional secondary action if meaningful
- Separate "no results" variant when search/filter is present (copy differs from first-time empty)

### Error
Standard error shape (matches the `error` prop in `FeatureViewProps`):
```typescript
{ title: string; message: string; code?: string }
```
- Show title + message
- Retry action wired to `onRetry`
- Optional error code display

### Ready / Success
- Renders with `mockRealistic`
- Must survive `mockStress`: long strings, missing optional fields, disabled actions — nothing breaks layout

### Pagination (when applicable)
- Emit `onPageChange` / `onPageSizeChange` — no internal data operations
- Show `totalItems` / `totalPages` when helpful
- Fully functional with mock data in dev preview

### Action Feedback
When actions exist (save, delete, submit):
- Disable button while pending
- Show inline feedback (spinner, label change, or toast trigger)
- Allow per-action error display — never assume success

---

## Step 4 — UI Quality Standards

These apply to every component generated. The output must be production-grade, not prototype-grade.

### Visual Consistency
- All spacing, color, typography, radius, and shadow must come from design tokens
- Prefer existing patterns over introducing new ones
- Flag any new visual pattern in the feature README

### Visual Quality (Production Standard)
UI must feel complete and considered at every state:
- Typography hierarchy: strong headline → readable body → muted metadata
- Consistent and intentional spacing — not uniform padding everywhere
- No tiny or light text that hurts readability
- Components must look finished at every state, including loading and empty

### Component Design
- Small, composable, single responsibility
- Clear props, minimal variants, no hardcoded copy where reuse is likely
- No speculative abstractions — extract only what is clearly needed

### Interaction Quality
Every interactive element must have:
- Hover, active, and focus states
- Disabled state where applicable
- No behavior that assumes data-fetching timing

### Accessibility (Required)
- Keyboard navigable for common flows
- Visible focus states (not suppressed)
- Icon-only buttons have `aria-label`
- Form fields support validation messaging patterns

### Responsiveness
- Works at mobile / tablet / desktop
- No hard-coded widths unless genuinely required

### Edge Case Handling
- Long strings do not break layout (truncate or wrap intentionally)
- Missing optional fields degrade gracefully
- Empty and error states are actionable and helpful, not dead ends

---

## Step 5 — Dev Preview Page

`src/app/dev/<featureName>/page.tsx` must:
- Run **without backend** — mock data only
- Control all UI states (loading, empty, error, ready) from the preview — no code changes needed to switch between them
- Control pagination values if applicable
- Be self-explanatory: a designer or engineer must understand what they are looking at without a guide

The dev preview is the primary handoff artifact. It must be clear, complete, and require no explanation.

```tsx
export default function FeatureDevPage() {
  return (
    <FeatureView
      state="ready"
      data={mockRealistic}
      onRetry={() => {}}
      onCreate={() => {}}
      onEdit={(id) => console.log("onEdit", id)}
      onDelete={(id) => console.log("onDelete", id)}
      onPageChange={(p) => console.log("onPageChange", p)}
    />
  );
}
```

> **Tip:** Wire state-switching controls (e.g., buttons or a dropdown) into the dev preview page so reviewers can cycle through all UI states without editing code.

---

## Step 6 — Component Promotion Rules

### New projects — default placement
- Primitives → `src/components/ui/`
- Reusable patterns → `src/components/patterns/`
- Feature-specific → stays in `src/features/<featureName>/`

Promote only when clearly reusable across features:
- `EmptyState`, `StatusBadge`, `SectionHeader`
- `PaginationControls`, `FormFieldWrapper`
- Card shells, Modal layout wrappers, Table shells (not feature-specific columns)

Never promote speculatively.

### Existing projects
- Feature-local first, always
- Do not modify shared components without explicit approval
- If cross-feature reuse is likely: propose extraction plan, API, location, and risk — wait for approval before implementing

### Scope rule
One feature PR = one feature. No refactoring of unrelated areas, no cross-folder moves, no public API changes without confirmation.

---

## Step 7 — README.md (Per Feature)

```markdown
# <Feature Name>

## What this is
Short description of the feature and its purpose.

## Dev preview
Route: `/dev/<feature-name>`
States available: loading / empty / error / ready

## Contract

### Data (types.ts)
UI view models only. Backend owns the mapping from service DTOs to these types.

### Events (events.ts)
| Callback | Signature | Description |
|---|---|---|
| onRetry | () => void | Triggered on error retry |
| onCreate | () => void | Triggered on primary CTA |
| onEdit | (id: string) => void | Triggered on row edit action |
| onDelete | (id: string) => void | Triggered on row delete action |
| onPageChange | (page: number) => void | Emitted on pagination |

## Presentational boundary
- URL/query param state: [UI-owned / External / N/A]
- Client-side filtering of loaded data: [yes / no]
- Toast/notifications: [UI triggers / host app owns / N/A]
- Form validation: [client-side only / none / N/A]

## Design tokens used
List every token referenced. Flag any token gaps or tokens introduced for this feature.

## Integration notes
What the integrating engineer needs to provide to wire this feature to real services.
Any assumptions made during the UI build.

## Known limitations / TODOs
Constraints, deferred decisions, or things that need team alignment.
```

---

## Step 8 — PR Package

**Branch:** `feature/ui-<feature-name>`
**Base:** `<base-branch>` (detected in Step 0.4)
**Title:** `[UI] <Feature Name> – Integration Ready`

```markdown
### Summary
2–4 sentences: what was added, where it lives, what it covers.

### What's Included
- `FeatureView` (pure presentational)
- `FeatureShell` (mock data wiring only — replaced at integration)
- `types.ts`, `events.ts`
- `mocks.ts` (realistic / stress / empty / error)
- Dev preview route `/dev/<feature-name>`
- Feature README

### UI States Implemented
- [x] Loading (skeleton, no layout shift)
- [x] Empty (+ "no results" variant if applicable)
- [x] Error (with retry)
- [x] Ready / success
- [x] Pagination (if applicable)

### Dev Preview
Route: `/dev/<feature-name>`
What can be tested: all UI states (loading / empty / error / ready), pagination controls.

### Integration Contract
- Data shape: see `types.ts`
- Event handlers: see `events.ts`
- Presentational boundary decisions: see README

### Assumptions & Ownership
- Types are UI view models — backend owns DTO → view model mapping
- All data operations (pagination, sort, filter, search) are event-driven
- `FeatureShell` mock wiring is replaced by the integrating engineer
- [Note any boundary decision made during build]

### Explicitly NOT Included
- No API calls
- No service logic
- No auth handling
- No data fetching
- No global state

### How To Test Locally
1. `npm run dev`
2. Navigate to `/dev/<feature-name>`
3. Verify all UI states render correctly

### Visual QA Checklist
- [ ] All states render correctly
- [ ] No layout shift loading → ready
- [ ] Long content does not break layout
- [ ] Empty and error states are actionable
- [ ] No console errors
- [ ] No network requests triggered

### Reusable Component Candidates
[List suggestions only — no extraction without team approval]

### Breaking Changes
None / [describe impact and migration notes if applicable]
```

---

## Step 9 — Self-Review Before Delivering

After generating code, run this checklist internally before outputting anything.

**Git hygiene**
- [ ] Branch is `feature/ui-<feature-name>`, based off the latest base branch
- [ ] No commits made to the base branch
- [ ] All feature files committed to the feature branch
- [ ] Branch pushed to remote before handing off PR description

**Code quality**
- [ ] No unnecessary complexity or duplication
- [ ] Naming consistent: `on` prefix for events, `is`/`has` for booleans
- [ ] Files in correct locations per project structure (camelCase folders, kebab-case URL paths)
- [ ] TypeScript correct, no unexplained `any`
- [ ] No forbidden integrations present

**UI quality**
- [ ] All 4 states implemented and reachable from dev preview
- [ ] Skeletons match final layout density
- [ ] Long strings handled (truncation or intentional wrapping)
- [ ] Missing optional fields degrade gracefully
- [ ] Hover / active / focus / disabled states on all interactive elements
- [ ] `aria-label` on all icon-only buttons
- [ ] Responsive at mobile / tablet / desktop
- [ ] UI looks production-complete at every state, not scaffolded

**Contracts**
- [ ] `types.ts` covers all data the UI needs
- [ ] `events.ts` covers all actions the UI exposes
- [ ] `mocks.ts` has realistic, domain-appropriate data (not placeholders)
- [ ] `mockError` shape matches the `error` prop type in `FeatureViewProps`
- [ ] Dev preview reaches all states without backend

**Then output:**
- Summary of what was built
- Any tradeoffs made
- Flagged token gaps or design assumptions
- Recommended follow-ups for the team

---

## Forbidden Defaults (Unless Explicitly Approved)

- No data fetching inside feature modules
- No API or service integration
- No server actions
- No react-query / swr / zustand / redux by default
- No new npm dependencies without approval
- No modifications to shared or design system components
- No refactoring of unrelated code in the same PR

If a project requires any of the above → ask and wait for approval before implementing.

---

## Done Criteria

A feature is complete only when:

1. Branch is `feature/ui-<feature-name>`, based off the latest base branch, pushed to remote
2. All required UI states work: loading, empty, error, ready
3. Dev preview exists and all UI states are reachable without backend
4. `types.ts`, `events.ts`, `mocks.ts` exist and are complete
5. Mocks use realistic, domain-appropriate data — no placeholder text
6. `mockError` shape matches the `error` prop in `FeatureViewProps`
7. No forbidden integrations present (unless explicitly approved)
8. README is clear enough for an engineer to wire the feature without reading source code
9. PR description is complete and accurate
10. Self-review checklist passed
