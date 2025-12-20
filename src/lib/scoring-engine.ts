import type { Product, RatingSnapshot, Phase, ExternalSignals, Economics, PerformanceSnapshot } from '@/types/product';

const ALGO_VERSION = 'v1.0';

// Z-score clipping bounds
const Z_CLIP_MIN = -3;
const Z_CLIP_MAX = 3;

// Pillar weights for composite score
const WEIGHTS = {
  idea: { dv: 0.40, ro: 0.30, ue: 0.30, lp: 0 },
  live: { dv: 0.35, ro: 0.25, ue: 0.25, lp: 0.15 },
};

// Reference benchmarks (would come from cohort analysis in production)
const BENCHMARKS = {
  searchTrendSlope: { mean: 0.1, std: 0.3 },
  keywordIntentRatio: { mean: 0.5, std: 0.2 },
  socialEngagementVelocity: { mean: 1000, std: 500 },
  competitorReviewDepth: { mean: 500, std: 300 },
  cpcEstimate: { mean: 2.0, std: 1.0 },
  sellerSaturation: { mean: 50, std: 30 },
  grossMarginPercent: { mean: 40, std: 15 },
  returnRate: { mean: 10, std: 5 },
  conversionRate: { mean: 3, std: 1.5 },
  repeatPurchaseRate: { mean: 20, std: 10 },
  discountDependency: { mean: 30, std: 15 },
  salesVelocity: { mean: 100, std: 50 },
};

// Utility functions
function clip(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function standardize(value: number | undefined, benchmark: { mean: number; std: number }): number | null {
  if (value === undefined || value === null) return null;
  return (value - benchmark.mean) / benchmark.std;
}

function logTransform(value: number | undefined): number | undefined {
  if (value === undefined || value === null) return undefined;
  return Math.log(1 + value);
}

// Standard normal CDF approximation
function normalCDF(z: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

  return 0.5 * (1.0 + sign * y);
}

// Map z-score to 300-900 scale
function zToNovaScale(z: number): number {
  const clipped = clip(z, Z_CLIP_MIN, Z_CLIP_MAX);
  const percentile = normalCDF(clipped);
  return Math.round(300 + 600 * percentile);
}

// Calculate Demand Velocity (DV) pillar z-score
function calculateDV(signals: ExternalSignals): { zScore: number | null; coverage: number } {
  const metrics: (number | null)[] = [];
  let available = 0;
  const total = 3;

  // Search trend slope (positive = good)
  const trendZ = standardize(signals.searchTrendSlope, BENCHMARKS.searchTrendSlope);
  if (trendZ !== null) { metrics.push(trendZ); available++; }

  // Keyword intent ratio (higher commercial intent = good)
  const intentZ = standardize(signals.keywordIntentRatio, BENCHMARKS.keywordIntentRatio);
  if (intentZ !== null) { metrics.push(intentZ); available++; }

  // Social engagement (log transform, higher = good)
  const socialLog = logTransform(signals.socialEngagementVelocity);
  const socialZ = standardize(socialLog, { mean: Math.log(1 + BENCHMARKS.socialEngagementVelocity.mean), std: 0.5 });
  if (socialZ !== null) { metrics.push(socialZ); available++; }

  if (metrics.length === 0) return { zScore: null, coverage: 0 };

  const avgZ = metrics.reduce((a, b) => a! + b!, 0)! / metrics.length;
  return { zScore: clip(avgZ, Z_CLIP_MIN, Z_CLIP_MAX), coverage: available / total };
}

// Calculate Red Ocean Pressure (RO) pillar z-score
// Note: Higher competition = NEGATIVE contribution, so we invert
function calculateRO(signals: ExternalSignals): { zScore: number | null; coverage: number } {
  const metrics: (number | null)[] = [];
  let available = 0;
  const total = 3;

  // Competitor review depth (higher = more competition = bad, so invert)
  const reviewLog = logTransform(signals.competitorReviewDepth);
  const reviewZ = standardize(reviewLog, { mean: Math.log(1 + BENCHMARKS.competitorReviewDepth.mean), std: 0.5 });
  if (reviewZ !== null) { metrics.push(-reviewZ); available++; } // Inverted

  // CPC estimate (higher = more competition = bad, so invert)
  const cpcZ = standardize(signals.cpcEstimate, BENCHMARKS.cpcEstimate);
  if (cpcZ !== null) { metrics.push(-cpcZ); available++; } // Inverted

  // Seller saturation (higher = bad, so invert)
  const saturationZ = standardize(signals.sellerSaturation, BENCHMARKS.sellerSaturation);
  if (saturationZ !== null) { metrics.push(-saturationZ); available++; } // Inverted

  if (metrics.length === 0) return { zScore: null, coverage: 0 };

  const avgZ = metrics.reduce((a, b) => a! + b!, 0)! / metrics.length;
  return { zScore: clip(avgZ, Z_CLIP_MIN, Z_CLIP_MAX), coverage: available / total };
}

// Calculate Unit Economics (UE) pillar z-score
function calculateUE(economics: Economics): { zScore: number | null; coverage: number } {
  const metrics: (number | null)[] = [];
  let available = 0;
  const total = 2;

  // Gross margin (higher = good)
  const marginZ = standardize(economics.grossMarginPercent, BENCHMARKS.grossMarginPercent);
  if (marginZ !== null) { metrics.push(marginZ); available++; }

  // Return rate (higher = bad, so invert)
  const returnZ = standardize(economics.returnRate, BENCHMARKS.returnRate);
  if (returnZ !== null) { metrics.push(-returnZ); available++; } // Inverted

  if (metrics.length === 0) return { zScore: null, coverage: 0 };

  const avgZ = metrics.reduce((a, b) => a! + b!, 0)! / metrics.length;
  return { zScore: clip(avgZ, Z_CLIP_MIN, Z_CLIP_MAX), coverage: available / total };
}

// Calculate Live Performance (LP) pillar z-score
function calculateLP(performance: PerformanceSnapshot): { zScore: number | null; coverage: number; sampleStrength: number } {
  const metrics: (number | null)[] = [];
  let available = 0;
  const total = 4;

  // Sales velocity (log transform, higher = good)
  const salesLog = logTransform(performance.recentUnitsSold);
  const salesZ = standardize(salesLog, { mean: Math.log(1 + BENCHMARKS.salesVelocity.mean), std: 0.5 });
  if (salesZ !== null) { metrics.push(salesZ); available++; }

  // Conversion rate (higher = good)
  const convZ = standardize(performance.conversionRate, BENCHMARKS.conversionRate);
  if (convZ !== null) { metrics.push(convZ); available++; }

  // Repeat purchase rate (higher = good)
  const repeatZ = standardize(performance.repeatPurchaseRate, BENCHMARKS.repeatPurchaseRate);
  if (repeatZ !== null) { metrics.push(repeatZ); available++; }

  // Discount dependency (higher = bad, so invert)
  const discountZ = standardize(performance.discountDependency, BENCHMARKS.discountDependency);
  if (discountZ !== null) { metrics.push(-discountZ); available++; } // Inverted

  // Sample strength based on sessions (diminishing returns)
  const sessions = performance.sessions ?? 0;
  const sampleStrength = sessions > 0 ? Math.min(1, Math.sqrt(sessions / 1000)) : 0;

  if (metrics.length === 0) return { zScore: null, coverage: 0, sampleStrength };

  const avgZ = metrics.reduce((a, b) => a! + b!, 0)! / metrics.length;
  return { zScore: clip(avgZ, Z_CLIP_MIN, Z_CLIP_MAX), coverage: available / total, sampleStrength };
}

// Calculate Confidence Index
function calculateCI(
  phase: Phase,
  dvCoverage: number,
  roCoverage: number,
  ueCoverage: number,
  lpCoverage: number,
  sampleStrength: number
): number {
  // Base coverage factor
  let coverageFactor: number;
  
  if (phase === 0) {
    // Ideas: only DV, RO, UE matter
    coverageFactor = (dvCoverage + roCoverage + ueCoverage) / 3;
  } else {
    // Live: all pillars matter
    coverageFactor = (dvCoverage + roCoverage + ueCoverage + lpCoverage) / 4;
  }

  // Sample factor only applies to live products
  const sampleFactor = phase === 0 ? 1 : Math.max(0.3, sampleStrength);

  return Math.round(coverageFactor * sampleFactor * 100) / 100;
}

// Main scoring function
export function calculateProductScore(product: Product): RatingSnapshot {
  const { phase, externalSignals, economics, performance } = product;

  // Calculate pillar scores
  const dv = calculateDV(externalSignals);
  const ro = calculateRO(externalSignals);
  const ue = calculateUE(economics);
  const lp = phase > 0 ? calculateLP(performance) : { zScore: null, coverage: 0, sampleStrength: 0 };

  // Use median (0) for missing pillars to avoid undefined composite
  const dvZ = dv.zScore ?? 0;
  const roZ = ro.zScore ?? 0;
  const ueZ = ue.zScore ?? 0;
  const lpZ = lp.zScore;

  // Calculate composite z-score
  const weights = phase === 0 ? WEIGHTS.idea : WEIGHTS.live;
  let compositeZ: number;

  if (phase === 0) {
    compositeZ = dvZ * weights.dv + roZ * weights.ro + ueZ * weights.ue;
  } else {
    const lpZSafe = lpZ ?? 0;
    compositeZ = dvZ * weights.dv + roZ * weights.ro + ueZ * weights.ue + lpZSafe * weights.lp;
  }

  // Calculate confidence index
  const ci = calculateCI(
    phase,
    dv.coverage,
    ro.coverage,
    ue.coverage,
    lp.coverage,
    lp.sampleStrength
  );

  // Convert to NovaScale
  const nsr = zToNovaScale(compositeZ);
  const pillarScores = {
    dv: zToNovaScale(dvZ),
    ro: zToNovaScale(roZ),
    ue: zToNovaScale(ueZ),
    lp: lpZ !== null ? zToNovaScale(lpZ) : null,
  };

  return {
    id: crypto.randomUUID(),
    productId: product.id,
    nsr,
    confidenceIndex: ci,
    pillarScores,
    pillarZScores: {
      dv: dvZ,
      ro: roZ,
      ue: ueZ,
      lp: lpZ,
    },
    phase,
    algoVersion: ALGO_VERSION,
    timestamp: new Date().toISOString(),
  };
}

// Export benchmarks for UI display
export const SCORING_BENCHMARKS = BENCHMARKS;
