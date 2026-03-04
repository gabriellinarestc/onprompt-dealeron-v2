import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Button Component System
 * 
 * Variants:
 * - primary (default): Main CTA - dark solid on light, light solid on dark
 * - secondary: Intermediary gray - for secondary actions like "Create Prompt"
 * - tertiary: Border only - for tertiary actions like "Export CSV"
 * - ghost: Subtle - for inline actions
 * - link: Text only - for navigation like "View All"
 * - destructive: Red - for dangerous actions
 * 
 * Sizes:
 * - sm: Small (h-8) - for inline actions, "View All" links
 * - md (default): Medium (h-9) - for standard buttons like "Create Prompt", "Export"
 * - lg: Large (h-11) - for hero CTAs
 * 
 * Icons:
 * - Icons are automatically sized based on button size
 * - Use gap-2 (default) or gap-1.5 (sm) for icon spacing
 * - Icons can be placed left or right of text
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        // Primary: Main CTA
        default: 'bg-button-primary-bg text-button-primary-fg hover:bg-button-primary-hover-bg',
        primary: 'bg-button-primary-bg text-button-primary-fg hover:bg-button-primary-hover-bg',
        // Secondary: Intermediary gray solid
        secondary: 'bg-button-secondary-bg text-button-secondary-fg hover:bg-button-secondary-hover-bg',
        // Tertiary: Border only (outline)
        tertiary: 'border border-button-tertiary-border bg-button-tertiary-bg text-button-tertiary-fg hover:bg-button-tertiary-hover-bg',
        outline: 'border border-button-tertiary-border bg-button-tertiary-bg text-button-tertiary-fg hover:bg-button-tertiary-hover-bg',
        // Ghost: Subtle background on hover
        ghost: 'text-button-ghost-fg hover:bg-button-ghost-hover-bg hover:text-button-ghost-hover-fg',
        // Link: Text only with underline
        link: 'text-button-link-fg hover:text-button-link-hover-fg hover:underline underline-offset-4',
        // Destructive: Danger actions
        destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
      },
      size: {
        // Small: h-8, text-xs, for inline actions
        sm: 'h-8 gap-1.5 px-3 text-xs [&_svg:not([class*="size-"])]:size-3.5',
        // Medium (default): h-9, text-sm, standard buttons
        default: 'h-9 gap-2 px-4 text-sm [&_svg:not([class*="size-"])]:size-4',
        md: 'h-9 gap-2 px-4 text-sm [&_svg:not([class*="size-"])]:size-4',
        // Large: h-11, text-base, hero CTAs
        lg: 'h-11 gap-2.5 px-6 text-base [&_svg:not([class*="size-"])]:size-5',
        // Icon only variants
        icon: 'size-9 [&_svg:not([class*="size-"])]:size-4',
        'icon-sm': 'size-8 [&_svg:not([class*="size-"])]:size-3.5',
        'icon-lg': 'size-11 [&_svg:not([class*="size-"])]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
