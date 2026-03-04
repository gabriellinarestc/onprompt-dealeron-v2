# Design System Changes

This document outlines the design system updates made in this branch, including primitive tokens, component tokens, and the button component system.

## Overview

The design system has been restructured into three layers:
1. **Primitive Tokens** - Raw color values (gray scale)
2. **Semantic Tokens** - Purpose-driven tokens (background, foreground, etc.)
3. **Component Tokens** - Component-specific tokens (button, input, card, etc.)

---

## 1. Primitive Tokens - Warm Gray Scale

A warm gray scale using OKLCH color format with subtle warm tints (hue 60).

### Light Theme

| Token | OKLCH Value | Lightness |
|-------|-------------|-----------|
| `--gray-50` | `oklch(0.985 0.002 60)` | 98.5% |
| `--gray-100` | `oklch(0.97 0.004 60)` | 97% |
| `--gray-200` | `oklch(0.94 0.006 60)` | 94% |
| `--gray-300` | `oklch(0.90 0.006 60)` | 90% |
| `--gray-400` | `oklch(0.70 0.006 60)` | 70% |
| `--gray-500` | `oklch(0.55 0.006 60)` | 55% |
| `--gray-600` | `oklch(0.48 0.006 60)` | 48% |
| `--gray-700` | `oklch(0.38 0.006 60)` | 38% |
| `--gray-800` | `oklch(0.25 0.006 60)` | 25% |
| `--gray-900` | `oklch(0.18 0.006 60)` | 18% |
| `--gray-950` | `oklch(0.13 0.005 50)` | 13% |

### Dark Theme (Inverted)

| Token | OKLCH Value | Lightness |
|-------|-------------|-----------|
| `--gray-50` | `oklch(0.95 0.003 60)` | 95% |
| `--gray-100` | `oklch(0.88 0.003 60)` | 88% |
| `--gray-200` | `oklch(0.75 0.004 60)` | 75% |
| `--gray-300` | `oklch(0.62 0.004 60)` | 62% |
| `--gray-400` | `oklch(0.50 0.004 60)` | 50% |
| `--gray-500` | `oklch(0.40 0.005 55)` | 40% |
| `--gray-600` | `oklch(0.32 0.005 50)` | 32% |
| `--gray-700` | `oklch(0.27 0.005 50)` | 27% |
| `--gray-800` | `oklch(0.22 0.005 50)` | 22% |
| `--gray-900` | `oklch(0.17 0.005 50)` | 17% |
| `--gray-950` | `oklch(0.13 0.005 50)` | 13% |

---

## 2. Component Tokens

### Button Tokens

| Token | Light Theme | Dark Theme | Description |
|-------|-------------|------------|-------------|
| **Primary** ||||
| `--button-primary-bg` | `oklch(0.52 0.24 315)` | `oklch(0.68 0.24 315)` | Purple/magenta brand color |
| `--button-primary-fg` | `oklch(0.98 0 0)` | `oklch(0.13 0.005 50)` | White / dark text |
| `--button-primary-hover-bg` | `oklch(0.47 0.22 315)` | `oklch(0.73 0.22 315)` | Darker / lighter on hover |
| **Secondary** ||||
| `--button-secondary-bg` | `var(--gray-600)` | `var(--gray-400)` | Intermediary gray |
| `--button-secondary-fg` | `var(--gray-50)` | `var(--gray-950)` | Light / dark text |
| `--button-secondary-hover-bg` | `var(--gray-500)` | `var(--gray-300)` | Lighter on hover |
| **Tertiary/Outline** ||||
| `--button-tertiary-bg` | `transparent` | `transparent` | No background |
| `--button-tertiary-fg` | `var(--gray-700)` | `var(--gray-200)` | Gray text |
| `--button-tertiary-border` | `var(--gray-300)` | `var(--gray-700)` | Border color |
| `--button-tertiary-hover-bg` | `var(--gray-100)` | `var(--gray-800)` | Subtle bg on hover |
| **Ghost** ||||
| `--button-ghost-fg` | `var(--gray-900)` | `var(--gray-50)` | Foreground color |
| `--button-ghost-hover-bg` | `var(--gray-200)` | `var(--gray-800)` | Subtle bg on hover |
| `--button-ghost-hover-fg` | `var(--gray-900)` | `var(--gray-50)` | Same as fg |
| **Link** ||||
| `--button-link-fg` | `var(--gray-900)` | `var(--gray-50)` | Foreground color |
| `--button-link-hover-fg` | `var(--gray-700)` | `var(--gray-200)` | Muted on hover |

### Input Tokens

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--input-bg` | `oklch(1 0 0)` | `var(--gray-900)` |
| `--input-fg` | `var(--gray-900)` | `var(--gray-50)` |
| `--input-border` | `var(--gray-300)` | `var(--gray-700)` |
| `--input-placeholder` | `var(--gray-500)` | `var(--gray-400)` |
| `--input-focus-ring` | `oklch(0.52 0.24 315)` | `oklch(0.68 0.24 315)` |
| `--input-disabled-bg` | `var(--gray-100)` | `var(--gray-800)` |
| `--input-disabled-fg` | `var(--gray-500)` | `var(--gray-500)` |

### Card Tokens

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--card-bg` | `oklch(1 0 0)` | `var(--gray-900)` |
| `--card-fg` | `var(--gray-900)` | `var(--gray-50)` |
| `--card-border` | `var(--gray-300)` | `var(--gray-700)` |
| `--card-header-fg` | `var(--gray-900)` | `var(--gray-50)` |
| `--card-description-fg` | `var(--gray-600)` | `var(--gray-300)` |

### Table Tokens

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--table-header-bg` | `var(--gray-100)` | `var(--gray-900)` |
| `--table-header-fg` | `var(--gray-600)` | `var(--gray-300)` |
| `--table-row-bg` | `oklch(1 0 0)` | `var(--gray-900)` |
| `--table-row-hover-bg` | `var(--gray-50)` | `var(--gray-800)` |
| `--table-border` | `var(--gray-200)` | `var(--gray-800)` |
| `--table-cell-fg` | `var(--gray-900)` | `var(--gray-50)` |

### Badge Tokens

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--badge-default-bg` | `var(--gray-200)` | `var(--gray-800)` |
| `--badge-default-fg` | `var(--gray-800)` | `var(--gray-100)` |
| `--badge-success-bg` | `oklch(0.92 0.08 155)` | `oklch(0.25 0.08 155)` |
| `--badge-success-fg` | `oklch(0.35 0.15 155)` | `oklch(0.75 0.15 155)` |
| `--badge-warning-bg` | `oklch(0.92 0.08 75)` | `oklch(0.28 0.08 75)` |
| `--badge-warning-fg` | `oklch(0.45 0.14 75)` | `oklch(0.82 0.14 75)` |
| `--badge-destructive-bg` | `oklch(0.92 0.08 25)` | `oklch(0.25 0.08 25)` |
| `--badge-destructive-fg` | `oklch(0.45 0.18 25)` | `oklch(0.72 0.18 25)` |

### Dropdown/Select Tokens

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--dropdown-bg` | `oklch(1 0 0)` | `var(--gray-900)` |
| `--dropdown-fg` | `var(--gray-900)` | `var(--gray-50)` |
| `--dropdown-border` | `var(--gray-300)` | `var(--gray-700)` |
| `--dropdown-item-hover-bg` | `var(--gray-100)` | `var(--gray-800)` |
| `--dropdown-item-selected-bg` | `var(--gray-200)` | `var(--gray-700)` |
| `--dropdown-separator` | `var(--gray-200)` | `var(--gray-800)` |

### Tooltip Tokens

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--tooltip-bg` | `var(--gray-900)` | `var(--gray-100)` |
| `--tooltip-fg` | `var(--gray-50)` | `var(--gray-950)` |

---

## 3. Button Component System

### Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `primary` / `default` | Purple/magenta brand color | Main CTAs (e.g., "Create Prompt") |
| `secondary` | Intermediary gray solid | Secondary actions |
| `tertiary` / `outline` | Border only, transparent bg | Tertiary actions (e.g., "Export CSV") |
| `ghost` | Text with subtle hover bg | Inline actions (e.g., "View All", "View Visitors") |
| `link` | Text only with underline on hover | Navigation links |
| `destructive` | Red background | Dangerous actions (e.g., "Delete") |

### Sizes

| Size | Height | Font | Icon | Use Case |
|------|--------|------|------|----------|
| `sm` | `h-8` | `text-xs` | `size-3.5` | Inline actions, navigation |
| `md` / `default` | `h-9` | `text-sm` | `size-4` | Standard buttons |
| `lg` | `h-11` | `text-base` | `size-5` | Hero CTAs |
| `icon` | `size-9` | - | `size-4` | Icon-only buttons |
| `icon-sm` | `size-8` | - | `size-3.5` | Small icon buttons |
| `icon-lg` | `size-11` | - | `size-5` | Large icon buttons |

### Usage Examples

```tsx
// Primary button (main CTA)
<Button variant="primary">
  <Plus />
  Create Prompt
</Button>

// Tertiary button (outline)
<Button variant="tertiary">
  <Download />
  Export CSV
</Button>

// Ghost button (inline action)
<Button variant="ghost" size="sm" asChild>
  <Link href="/prompts">
    View All
    <ArrowRight />
  </Link>
</Button>

// Destructive button
<Button variant="destructive">
  <Trash />
  Delete
</Button>
```

---

## 4. Instructions to Apply

### Step 1: Update `globals.css`

Replace your existing `globals.css` with the new version that includes:
- Primitive gray scale tokens (`--gray-50` to `--gray-950`)
- Component tokens for buttons, inputs, cards, tables, badges, dropdowns, tooltips
- Theme mappings in `@theme inline` block

### Step 2: Update `components/ui/button.tsx`

Replace your button component with the new version that uses:
- Component token classes (`bg-button-primary-bg`, etc.)
- New variants: `primary`, `secondary`, `tertiary`, `ghost`, `link`, `destructive`
- New sizes: `sm`, `md`/`default`, `lg`, `icon`, `icon-sm`, `icon-lg`

### Step 3: Update Button Usage

Update existing button usage across the codebase:

```tsx
// Old
<Button className="gap-2">
  <Plus className="size-4" />
  Create
</Button>

// New
<Button variant="primary">
  <Plus />
  Create
</Button>
```

```tsx
// Old
<Button variant="outline" className="gap-2">
  <Download className="size-4" />
  Export
</Button>

// New
<Button variant="tertiary">
  <Download />
  Export
</Button>
```

```tsx
// Old
<Button variant="ghost" size="sm" className="gap-1 text-xs text-foreground hover:text-foreground">
  View All
  <ArrowRight className="size-3" />
</Button>

// New
<Button variant="ghost" size="sm">
  View All
  <ArrowRight />
</Button>
```

### Step 4: Use Tailwind Classes

The primitive gray scale is available as Tailwind classes:

```tsx
<div className="bg-gray-100 text-gray-900">
  Light background with dark text
</div>

<div className="bg-gray-800 text-gray-50">
  Dark background with light text
</div>
```

---

## Files Changed

- `app/globals.css` - Complete redesign with token architecture
- `components/ui/button.tsx` - New variant and size system

## Notes

- All colors use OKLCH format for perceptually uniform color manipulation
- The gray scale has a subtle warm tint (hue 60) for a softer appearance
- Component tokens reference primitive tokens, making theme adjustments easy
- Icons inside buttons are automatically sized based on the button size
