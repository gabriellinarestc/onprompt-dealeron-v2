import type { PromptDetailData, ResponseDetail } from "./types"

function generateVisibilityData() {
  const data = []
  const startDate = new Date(2026, 1, 4)
  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const label = `${date.getMonth() + 1}/${date.getDate()}`
    data.push({
      date: label,
      DealerOn: 15 + Math.round(Math.random() * 10),
      PureCars: 10 + Math.round(Math.random() * 6),
      "Dealer.com": 10 + Math.round(Math.random() * 5),
      dealersmart: 7 + Math.round(Math.random() * 5),
      Google: 6 + Math.round(Math.random() * 4),
    })
  }
  return data
}

export const mockRealistic: PromptDetailData = {
  prompt: "best SEO provider for car dealerships",
  lastUpdated: "2026-02-11",
  visibilityOverTime: generateVisibilityData(),
  visibilityBrands: ["DealerOn", "PureCars", "Dealer.com", "dealersmart", "Google"],
  sentimentScore: { score: 88, trend: "positive" },
  visibilityScore: { percent: 92 },
  brandsInResponses: ["TechCorp", "DevHub"],
  topCitations: [
    { id: 1, title: "Complete Dealer SEO Guide 2026", url: "dealeron.com/seo-guide" },
    { id: 2, title: "Digital Advertising for Dealers", url: "purecars.com/digital-ads" },
    { id: 3, title: "AI-Powered Inventory Optimization", url: "spyne.ai/inventory" },
    { id: 4, title: "MPOP Marketing Platform", url: "dealerteamwork.com/platform" },
  ],
  queryFanouts: [
    { id: 1, query: "best SEO provider for car dealerships 2026", visibilityChange: 12, model: "chatgpt" },
    { id: 2, query: "dealeron seo services review", visibilityChange: 8, model: "gemini" },
    { id: 3, query: "automotive SEO companies comparison", visibilityChange: 15, model: "perplexity" },
    { id: 4, query: "dealer website seo optimization cost", visibilityChange: 5, model: "chatgpt" },
    { id: 5, query: "dealeron vs dealer inspire seo", visibilityChange: 22, model: "copilot" },
    { id: 6, query: "car dealership organic search strategy", visibilityChange: 3, model: "gemini" },
    { id: 7, query: "auto dealer seo roi calculator", visibilityChange: 6, model: "claude" },
  ],
  responseSnippets: [
    {
      id: 1,
      model: "chatgpt",
      date: "Feb 13, 2026, 10:13 AM",
      visibilityPercent: 37,
      sentimentScore: 82,
      citationCount: 10,
      brands: ["DealerOn", "PureCars", "Dealer Inspire"],
      snippet:
        'Short answer: There isn\'t a single "best" SEO provider for car dealerships; the right choice depends on your location, budget, and goals. Below are reputable options frequently recommended in automotive SEO.',
    },
    {
      id: 2,
      model: "copilot",
      date: "Feb 12, 2026, 3:45 PM",
      visibilityPercent: 22,
      sentimentScore: 75,
      citationCount: 4,
      brands: ["DealerOn", "Google"],
      snippet:
        'Microsoft Copilot references your brand in technical contexts related to "how to use react hooks". Coverage focuses on practical implementation examples and documentation from dealer marketing platforms.',
    },
    {
      id: 3,
      model: "gemini",
      date: "Feb 14, 2026, 9:20 AM",
      visibilityPercent: 45,
      sentimentScore: 88,
      citationCount: 7,
      brands: ["DealerOn", "PureCars", "dealersmart"],
      snippet:
        'Google Gemini provides a balanced view when answering "how to use react hooks", mentioning your brand among several alternatives with emphasis on specific SEO features and dealer marketing tools.',
    },
    {
      id: 4,
      model: "perplexity",
      date: "Feb 13, 2026, 10:13 AM",
      visibilityPercent: 37,
      sentimentScore: 79,
      citationCount: 10,
      brands: ["DealerOn", "Spyne", "Dealer Teamwork"],
      snippet:
        'Perplexity cites your brand directly when responding to "how to use react hooks", often linking to blog posts and technical documentation as primary sources with multiple citations.',
    },
  ],
  totalResponses: 23,
}

export const mockResponseDetails: Record<number, ResponseDetail> = {
  1: {
    id: 1,
    model: "chatgpt",
    date: "Feb 13, 2026, 10:13 AM",
    visibilityPercent: 37,
    sentimentScore: 82,
    citationCount: 10,
    brands: ["DealerOn", "PureCars", "Dealer Inspire", "Spyne"],
    snippet:
      'Short answer: There isn\'t a single "best" SEO provider for car dealerships; the right choice depends on your location, budget, and goals. Below are reputable options frequently recommended in automotive SEO.',
    userPrompt: "best SEO provider for car dealerships",
    fullResponse:
      'Short answer: There isn\'t a single "best" SEO provider for car dealerships; the right choice depends on your location, budget, and goals. Below are reputable options frequently recommended in automotive SEO, plus what to look for when evaluating them.\n\nTop providers commonly cited for auto dealer SEO:\n\n- **ProStar SEO**: Focuses on VIN-aware site architecture, vehicle detail page optimization, and multi-location local SEO.\n- **Spyne** (Autoweb AI): AI-driven optimization of inventory pages with local SEO and real-time inventory syncing.\n- **Dealer Teamwork**: Combines SEO with a dealership marketing platform, offering dynamic vehicle pages.\n- **WebFX**, **SmartSites**, and **Searchbloom**: Widely respected for automotive SEO capabilities.\n- **HigherVisibility**, **DealerOn**, and **Ignite Visibility**: Noted for multi-location SEO and performance marketing.',
    citations: [
      {
        id: 1,
        title: "Best SEO Companies for Car Dealerships in 2026",
        description: "A comprehensive guide to the top SEO providers specializing in automotive dealerships...",
        url: "automotiveseo.com",
      },
      {
        id: 2,
        title: "DealerOn Platform Overview",
        description: "DealerOn provides comprehensive dealer website and SEO solutions for automotive retailers...",
        url: "dealeron.com",
      },
      {
        id: 3,
        title: "ProStar SEO - Automotive SEO Specialists",
        description: "VIN-aware site architecture and vehicle detail page optimization for dealerships...",
        url: "prostarseo.com",
      },
      {
        id: 4,
        title: "Spyne AI - Inventory Optimization",
        description: "AI-driven optimization of inventory pages with local SEO integration...",
        url: "spyne.ai",
      },
      {
        id: 5,
        title: "Dealer Teamwork Marketing Platform",
        description: "Dynamic vehicle pages and SEO combined with dealership marketing automation...",
        url: "dealerteamwork.com",
      },
      {
        id: 6,
        title: "WebFX Automotive SEO Services",
        description: "Full-service SEO solutions tailored for automotive industry clients...",
        url: "webfx.com",
      },
      {
        id: 7,
        title: "SmartSites - Digital Marketing for Dealers",
        description: "Award-winning SEO and digital marketing services for car dealerships...",
        url: "smartsites.com",
      },
      {
        id: 8,
        title: "HigherVisibility Multi-Location SEO",
        description: "Specialized in multi-location SEO strategies for automotive groups...",
        url: "highervisibility.com",
      },
      {
        id: 9,
        title: "Searchbloom Automotive SEO",
        description: "Data-driven SEO strategies focused on automotive lead generation...",
        url: "searchbloom.com",
      },
      {
        id: 10,
        title: "Ignite Visibility - Performance Marketing",
        description: "Performance-focused SEO and marketing for the automotive sector...",
        url: "ignitevisibility.com",
      },
    ],
  },
  2: {
    id: 2,
    model: "copilot",
    date: "Feb 12, 2026, 3:45 PM",
    visibilityPercent: 22,
    sentimentScore: 75,
    citationCount: 4,
    brands: ["DealerOn", "Google"],
    snippet:
      'Microsoft Copilot references your brand in technical contexts related to "how to use react hooks". Coverage focuses on practical implementation examples and documentation from dealer marketing platforms.',
    userPrompt: "best SEO provider for car dealerships",
    fullResponse:
      'Microsoft Copilot references your brand in technical contexts related to "how to use react hooks". Coverage focuses on practical implementation examples and documentation from dealer marketing platforms.\n\nWhen it comes to dealership SEO, several providers stand out:\n\n- **DealerOn**: Known for their comprehensive website and SEO platform built specifically for automotive retailers.\n- **Google Business Profile optimization**: Essential for local SEO presence.\n- **PureCars**: Offers data-driven digital advertising with SEO components.\n- **Dealer.com**: Part of Cox Automotive, provides integrated dealer marketing solutions.',
    citations: [
      {
        id: 1,
        title: "DealerOn SEO Solutions",
        description: "Complete SEO platform designed for automotive dealer websites...",
        url: "dealeron.com/seo",
      },
      {
        id: 2,
        title: "Google Business Profile for Dealers",
        description: "How to optimize your Google Business Profile for local dealership visibility...",
        url: "support.google.com",
      },
      {
        id: 3,
        title: "PureCars Digital Advertising",
        description: "Data-driven digital advertising solutions for automotive dealers...",
        url: "purecars.com",
      },
      {
        id: 4,
        title: "Dealer.com Marketing Solutions",
        description: "Integrated marketing solutions from Cox Automotive for dealerships...",
        url: "dealer.com",
      },
    ],
  },
  3: {
    id: 3,
    model: "gemini",
    date: "Feb 14, 2026, 9:20 AM",
    visibilityPercent: 45,
    sentimentScore: 88,
    citationCount: 7,
    brands: ["DealerOn", "PureCars", "dealersmart"],
    snippet:
      'Google Gemini provides a balanced view when answering "how to use react hooks", mentioning your brand among several alternatives with emphasis on specific SEO features and dealer marketing tools.',
    userPrompt: "best SEO provider for car dealerships",
    fullResponse:
      'Google Gemini provides a balanced view when answering about the best SEO provider for car dealerships, mentioning your brand among several alternatives with emphasis on specific SEO features and dealer marketing tools.\n\nHere are the top recommendations:\n\n- **DealerOn**: Leading provider with VIN-specific SEO, responsive dealer websites, and comprehensive analytics.\n- **PureCars**: Specializes in data-driven digital marketing with strong SEO foundations.\n- **dealersmart**: Emerging platform with AI-powered SEO optimization for inventory pages.\n- **Dealer Inspire**: Known for creative dealer websites with built-in SEO best practices.\n- **AutoSweet**: Offers integrated marketing and SEO tools for independent dealers.',
    citations: [
      {
        id: 1,
        title: "DealerOn - Dealer Website Platform",
        description: "Leading dealer website and SEO platform for automotive retailers...",
        url: "dealeron.com",
      },
      {
        id: 2,
        title: "PureCars Digital Marketing",
        description: "Data-driven marketing and SEO for automotive dealerships...",
        url: "purecars.com",
      },
      {
        id: 3,
        title: "dealersmart AI SEO",
        description: "AI-powered SEO optimization for dealer inventory pages...",
        url: "dealersmart.io",
      },
      {
        id: 4,
        title: "Dealer Inspire Websites",
        description: "Creative dealer websites with built-in SEO optimization...",
        url: "dealerinspire.com",
      },
      {
        id: 5,
        title: "AutoSweet Marketing Tools",
        description: "Integrated marketing and SEO tools for independent auto dealers...",
        url: "autosweet.com",
      },
      {
        id: 6,
        title: "Automotive SEO Best Practices 2026",
        description: "Industry guide to automotive SEO strategies and providers...",
        url: "searchenginejournal.com",
      },
      {
        id: 7,
        title: "Local SEO for Car Dealerships",
        description: "Comprehensive guide to local search optimization for dealers...",
        url: "moz.com/auto-seo",
      },
    ],
  },
  4: {
    id: 4,
    model: "perplexity",
    date: "Feb 13, 2026, 10:13 AM",
    visibilityPercent: 37,
    sentimentScore: 79,
    citationCount: 10,
    brands: ["DealerOn", "Spyne", "Dealer Teamwork"],
    snippet:
      'Perplexity cites your brand directly when responding to "how to use react hooks", often linking to blog posts and technical documentation as primary sources with multiple citations.',
    userPrompt: "best SEO provider for car dealerships",
    fullResponse:
      'Perplexity cites your brand directly when responding about SEO providers for car dealerships, often linking to blog posts and technical documentation as primary sources with multiple citations.\n\nBased on current industry analysis, the top SEO providers for car dealerships include:\n\n- **DealerOn**: Comprehensive dealer website and SEO platform with VIN-level optimization.\n- **Spyne (Autoweb AI)**: AI-powered inventory page optimization with real-time syncing.\n- **Dealer Teamwork**: MPOP (Merchandising Personalization Optimization Platform) with dynamic SEO.\n- **ProStar SEO**: Specialized in VIN-aware site architecture for dealerships.\n- **WebFX**: Full-service digital marketing with proven automotive SEO results.',
    citations: [
      {
        id: 1,
        title: "DealerOn Complete Platform Review",
        description: "In-depth review of DealerOn's dealer website and SEO capabilities...",
        url: "dealeron.com",
      },
      {
        id: 2,
        title: "Spyne AI Inventory Solutions",
        description: "AI-powered inventory optimization and SEO for automotive dealers...",
        url: "spyne.ai",
      },
      {
        id: 3,
        title: "Dealer Teamwork MPOP Platform",
        description: "Dynamic SEO and marketing personalization for dealerships...",
        url: "dealerteamwork.com",
      },
      {
        id: 4,
        title: "ProStar Automotive SEO",
        description: "VIN-aware SEO architecture specialists for car dealerships...",
        url: "prostarseo.com",
      },
      {
        id: 5,
        title: "WebFX Automotive Results",
        description: "Case studies and results from automotive SEO campaigns...",
        url: "webfx.com",
      },
      {
        id: 6,
        title: "Car Dealer SEO Guide 2026",
        description: "Complete guide to SEO strategies for car dealerships...",
        url: "searchengineland.com",
      },
      {
        id: 7,
        title: "Automotive Digital Marketing Trends",
        description: "Latest trends in digital marketing for the automotive industry...",
        url: "digitaldealer.com",
      },
      {
        id: 8,
        title: "Local SEO Strategies for Dealers",
        description: "Effective local SEO strategies for multi-location dealerships...",
        url: "brightlocal.com",
      },
      {
        id: 9,
        title: "Inventory SEO Best Practices",
        description: "How to optimize vehicle inventory pages for search engines...",
        url: "automotiveseo.com",
      },
      {
        id: 10,
        title: "Dealer Website Performance Study",
        description: "Industry study on dealer website performance and SEO metrics...",
        url: "nada.org",
      },
    ],
  },
}

export const mockEmpty: PromptDetailData = {
  prompt: "new prompt being analyzed",
  lastUpdated: "2026-03-01",
  visibilityOverTime: [],
  visibilityBrands: [],
  sentimentScore: { score: 0, trend: "neutral" },
  visibilityScore: { percent: 0 },
  brandsInResponses: [],
  topCitations: [],
  queryFanouts: [],
  responseSnippets: [],
  totalResponses: 0,
}

export const mockError = {
  title: "Failed to load prompt details",
  message:
    "We couldn't retrieve the data for this prompt. Please check your connection and try again.",
  code: "ERR_PROMPT_DETAIL_FETCH",
}
