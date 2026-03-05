import type { ScoreCardItem, ModelMentionItem } from "./types"

export const mockScores: ScoreCardItem[] = [
  { value: 82, label: "Visibility" },
  { value: 37, label: "Content Coverage" },
]

export const mockModelData: ModelMentionItem[] = [
  { key: "chatgpt", mentions: 187, change: "+34%" },
  { key: "claude", mentions: 94, change: "+28%" },
  { key: "gemini", mentions: 71, change: "+52%" },
  { key: "aioverview", mentions: 63, change: "+41%" },
  { key: "perplexity", mentions: 38, change: "+19%" },
  { key: "copilot", mentions: 22, change: "+12%" },
]
