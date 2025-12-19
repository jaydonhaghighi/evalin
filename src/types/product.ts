// Product Phase
export type Phase = 0 | 1 | 2;

export const PHASE_LABELS: Record<Phase, string> = {
  0: 'Idea',
  1: 'Early Live',
  2: 'Mature Live',
};

// Rating Labels based on NSR score
export type RatingLabel = 'Scale' | 'Defend' | 'Test' | 'Retire';

export function getRatingLabel(nsr: number): RatingLabel {
  if (nsr >= 750) return 'Scale';
  if (nsr >= 600) return 'Defend';
  if (nsr >= 450) return 'Test';
  return 'Retire';
}

// External Signals (Demand & Competition)
export interface ExternalSignals {
  // Demand metrics
  searchVolume?: number;
  searchTrendSlope?: number; // -1 to 1 (declining to growing)
  keywordIntentRatio?: number; // 0 to 1 (commercial vs informational)
  socialEngagementVelocity?: number;
  
  // Competition metrics
  competitorReviewDepth?: number; // avg reviews per competitor
  cpcEstimate?: number; // cost per click
  sellerSaturation?: number; // sellers per demand unit
}

// Unit Economics
export interface Economics {
  grossMarginPercent?: number; // 0 to 100
  cogs?: number;
  landedCost?: number;
  returnRate?: number; // 0 to 100 (%)
}

// Performance Snapshot (for live products)
export interface PerformanceSnapshot {
  recentUnitsSold?: number;
  sessions?: number;
  conversionRate?: number; // 0 to 100 (%)
  repeatPurchaseRate?: number; // 0 to 100 (%)
  discountDependency?: number; // 0 to 100 (% of sales with discount)
}

// Rating Snapshot
export interface RatingSnapshot {
  id: string;
  productId: string;
  nsr: number; // 300-900
  confidenceIndex: number; // 0.00-1.00
  pillarScores: {
    dv: number; // Demand Velocity (300-900)
    ro: number; // Red Ocean Pressure (300-900)
    ue: number; // Unit Economics (300-900)
    lp: number | null; // Live Performance (300-900) - null for ideas
  };
  pillarZScores: {
    dv: number;
    ro: number;
    ue: number;
    lp: number | null;
  };
  phase: Phase;
  algoVersion: string;
  timestamp: string;
}

// Main Product entity
export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags: string[];
  phase: Phase;
  externalSignals: ExternalSignals;
  economics: Economics;
  performance: PerformanceSnapshot;
  latestRating?: RatingSnapshot;
  ratingHistory: RatingSnapshot[];
  createdAt: string;
  updatedAt: string;
}

// Create product input
export interface CreateProductInput {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  phase: Phase;
  externalSignals?: ExternalSignals;
  economics?: Economics;
  performance?: PerformanceSnapshot;
}
