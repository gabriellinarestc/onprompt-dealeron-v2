import type { PromptItem } from "./types"

export const mockBrandNames: Record<string, string> = {
  DO: "DealerOn",
  DI: "Dealer Inspire",
  CD: "CDK Global",
  AT: "AutoTrader",
  CC: "Cars.com",
}

export const mockPromptsData: PromptItem[] = [
  {
    prompt: "best car dealer website platforms for lead generation",
    sentiment: 89,
    visibility: "91%",
    brands: ["DO", "DI", "CD"],
  },
  {
    prompt: "top automotive SEO companies for dealerships",
    sentiment: 92,
    visibility: "88%",
    brands: ["DO", "DI"],
  },
  {
    prompt: "OEM certified website providers for car dealerships",
    sentiment: 93,
    visibility: "87%",
    brands: ["DO", "DI", "CD"],
  },
  {
    prompt: "how to increase car dealership website conversions",
    sentiment: 87,
    visibility: "85%",
    brands: ["DO", "CD"],
  },
  {
    prompt: "how to optimize dealership inventory pages for search",
    sentiment: 88,
    visibility: "84%",
    brands: ["DO", "DI"],
  },
  {
    prompt: "best digital advertising solutions for auto dealers",
    sentiment: 91,
    visibility: "82%",
    brands: ["DO", "DI", "AT"],
  },
  {
    prompt: "dealership website ADA compliance requirements",
    sentiment: 83,
    visibility: "81%",
    brands: ["DO", "CD", "DI"],
  },
  {
    prompt: "dealer website providers comparison 2025",
    sentiment: 84,
    visibility: "79%",
    brands: ["DO", "DI", "CD"],
  },
  {
    prompt: "automotive PPC management for multi-rooftop dealers",
    sentiment: 90,
    visibility: "78%",
    brands: ["DO", "DI"],
  },
]
