import type { SentimentDataPoint } from "./types"

export const mockSentimentData: SentimentDataPoint[] = [
  { date: "Jan 15", score: 61 },
  { date: "Jan 22", score: 64 },
  { date: "Jan 29", score: 67 },
  { date: "Feb 05", score: 72 },
  { date: "Feb 12", score: 69 },
  { date: "Feb 19", score: 74 },
  { date: "Feb 26", score: 78 },
  { date: "Mar 05", score: 75 },
  { date: "Mar 12", score: 80 },
  { date: "Mar 19", score: 83 },
  { date: "Mar 26", score: 79 },
  { date: "Apr 02", score: 85 },
  { date: "Apr 09", score: 88 },
  { date: "Apr 16", score: 86 },
]

export const mockCurrentScore = mockSentimentData[mockSentimentData.length - 1].score
