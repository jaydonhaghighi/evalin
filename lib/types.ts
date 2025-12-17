// Product phases
export type ProductPhase = 0 | 1 | 2 // 0 = Idea, 1 = Early Live, 2 = Mature Live

// Product entity
export interface Product {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  phase: ProductPhase
  createdAt: Date
  updatedAt: Date
}

// External signals (demand & competition)
export interface ExternalSignals {
  productId: string
  // Demand metrics
  searchVolume?: number // Monthly searches
  searchTrendSlope?: number // -1 to 1 slope
  keywordIntentRatio?: number // 0 to 1 (commercial vs informational)
  socialEngagementVelocity?: number // Engagement rate
  // Competition metrics
  competitorReviewDepth?: number // Average review count
  cpcEstimate?: number // Cost per click in USD
  sellerSaturation?: number // Sellers per unit demand
}

// Unit economics
export interface Economics {
  productId: string
  grossMarginPercent?: number // 0-100
  cogs?: number // Cost of goods sold
  landedCost?: number // Total landed cost
  categoryReturnRate?: number // 0-100
}

// Live performance snapshot
export interface PerformanceSnapshot {
  productId: string
  unitsSold?: number
  sessions?: number
  conversionRate?: number // 0-100
  repeatPurchaseRate?: number // 0-100
  discountDependency?: number // 0-100, % of sales with discount
  periodStart: Date
  periodEnd: Date
}

// Individual pillar score (300-900)
export interface PillarScore {
  score: number // 300-900
  zScore: number // Raw z-score before mapping
  metrics: Record<string, number> // Contributing metrics
}

// Complete rating snapshot
export interface RatingSnapshot {
  id: string
  productId: string
  // Overall rating
  cpr: number // Cohorent Product Rating: 300-900
  cci: number // Cohorent Confidence Index: 0.00-1.00
  phase: ProductPhase
  algoVersion: string
  timestamp: Date
  // Pillar ratings
  demandVelocity: PillarScore
  redOceanPressure: PillarScore
  unitEconomics: PillarScore
  livePerformance?: PillarScore // Only for live products
  // Derived label
  statusLabel: "Scale" | "Optimize" | "Test" | "Retire"
}

// Combined product data for scoring
export interface ProductForScoring {
  product: Product
  externalSignals?: ExternalSignals
  economics?: Economics
  performance?: PerformanceSnapshot
}
