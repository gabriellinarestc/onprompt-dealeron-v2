// Canonical AI model registry — single source of truth for names, colors, and logos.
// Import and use MODEL_CONFIG throughout the dashboard to ensure consistency.

export type ModelKey = "chatgpt" | "claude" | "gemini" | "perplexity" | "copilot"

export interface ModelConfig {
  key: ModelKey
  name: string
  /** CSS custom property referencing the brand color */
  color: string
  /** Tailwind bg utility class */
  bgClass: string
  /** Inline hex for Recharts / SVG contexts where CSS vars aren't resolved */
  hex: string
}

export const MODEL_CONFIG: Record<ModelKey, ModelConfig> = {
  chatgpt: {
    key: "chatgpt",
    name: "ChatGPT",
    color: "var(--model-chatgpt)",
    bgClass: "bg-model-chatgpt",
    hex: "#10a37f",
  },
  claude: {
    key: "claude",
    name: "Claude",
    color: "var(--model-claude)",
    bgClass: "bg-model-claude",
    hex: "#d97757",
  },
  gemini: {
    key: "gemini",
    name: "Gemini",
    color: "var(--model-gemini)",
    bgClass: "bg-model-gemini",
    hex: "#4285f4",
  },
  perplexity: {
    key: "perplexity",
    name: "Perplexity",
    color: "var(--model-perplexity)",
    bgClass: "bg-model-perplexity",
    hex: "#20b8cd",
  },
  copilot: {
    key: "copilot",
    name: "Copilot",
    color: "var(--model-copilot)",
    bgClass: "bg-model-copilot",
    hex: "#0078d4",
  },
}

export const MODELS = Object.values(MODEL_CONFIG)

/** Map a domain/name string to a ModelKey, or return null */
export function resolveModelKey(value: string): ModelKey | null {
  const lower = value.toLowerCase()
  if (lower.includes("chatgpt") || lower.includes("openai")) return "chatgpt"
  if (lower.includes("claude") || lower.includes("anthropic")) return "claude"
  if (lower.includes("gemini") || lower.includes("google")) return "gemini"
  if (lower.includes("perplexity")) return "perplexity"
  if (lower.includes("copilot") || lower.includes("microsoft") || lower.includes("bing")) return "copilot"
  return null
}
