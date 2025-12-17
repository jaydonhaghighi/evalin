import type { ProductForScoring, RatingSnapshot, PillarScore } from "./types"

// Configuration
const ALGO_VERSION = "v1"
const MIN_RATING = 300
const MAX_RATING = 900
const Z_SCORE_CLIP = 3 // Clip z-scores to [-3, 3]

// Pillar weights for composite score
const PILLAR_WEIGHTS = {
  idea: {
    // Phase 0
    demandVelocity: 0.4,
    redOceanPressure: 0.3,
    unitEconomics: 0.3,
    livePerformance: 0,
  },
  live: {
    // Phase 1 & 2
    demandVelocity: 0.35,
    redOceanPressure: 0.25,
    unitEconomics: 0.25,
    livePerformance: 0.15,
  },
}

// Utility: Apply log transformation for skewed metrics
function logTransform(value: number): number {
  return Math.log(1 + Math.max(0, value))
}

// Utility: Clip value to range
function clip(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// Utility: Standard normal CDF approximation (for z-score to percentile)
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

// Map z-score to 300-900 rating scale
function zScoreToRating(zScore: number): number {
  const clipped = clip(zScore, -Z_SCORE_CLIP, Z_SCORE_CLIP)
  const percentile = normalCDF(clipped)
  const rating = MIN_RATING + (MAX_RATING - MIN_RATING) * percentile
  return Math.round(rating)
}

// Compute Demand Velocity pillar
function computeDemandVelocity(data: ProductForScoring): PillarScore {
  const signals = data.externalSignals
  const metrics: Record<string, number> = {}
  let sum = 0
  let count = 0

  if (signals?.searchVolume !== undefined) {
    const normalized = logTransform(signals.searchVolume) / 10 // Scale factor
    metrics.searchVolume = normalized
    sum += normalized
    count++
  }

  if (signals?.searchTrendSlope !== undefined) {
    // Already normalized to [-1, 1], scale up
    const normalized = signals.searchTrendSlope * 2
    metrics.searchTrendSlope = normalized
    sum += normalized
    count++
  }

  if (signals?.keywordIntentRatio !== undefined) {
    // 0-1, higher is better (commercial intent)
    const normalized = (signals.keywordIntentRatio - 0.5) * 4
    metrics.keywordIntentRatio = normalized
    sum += normalized
    count++
  }

  if (signals?.socialEngagementVelocity !== undefined) {
    const normalized = logTransform(signals.socialEngagementVelocity) / 5
    metrics.socialEngagementVelocity = normalized
    sum += normalized
    count++
  }

  const zScore = count > 0 ? sum / count : 0
  return {
    score: zScoreToRating(zScore),
    zScore,
    metrics,
  }
}

// Compute Red Ocean Pressure pillar (inverse - higher pressure = lower score)
function computeRedOceanPressure(data: ProductForScoring): PillarScore {
  const signals = data.externalSignals
  const metrics: Record<string, number> = {}
  let sum = 0
  let count = 0

  if (signals?.competitorReviewDepth !== undefined) {
    // Higher reviews = more competition = negative
    const normalized = -logTransform(signals.competitorReviewDepth) / 8
    metrics.competitorReviewDepth = normalized
    sum += normalized
    count++
  }

  if (signals?.cpcEstimate !== undefined) {
    // Higher CPC = more expensive = negative
    const normalized = -logTransform(signals.cpcEstimate) / 3
    metrics.cpcEstimate = normalized
    sum += normalized
    count++
  }

  if (signals?.sellerSaturation !== undefined) {
    // Higher saturation = more sellers = negative
    const normalized = -logTransform(signals.sellerSaturation) / 5
    metrics.sellerSaturation = normalized
    sum += normalized
    count++
  }

  const zScore = count > 0 ? sum / count : 0
  return {
    score: zScoreToRating(zScore),
    zScore,
    metrics,
  }
}

// Compute Unit Economics pillar
function computeUnitEconomics(data: ProductForScoring): PillarScore {
  const econ = data.economics
  const metrics: Record<string, number> = {}
  let sum = 0
  let count = 0

  if (econ?.grossMarginPercent !== undefined) {
    // Higher margin = better, normalize around 30% baseline
    const normalized = (econ.grossMarginPercent - 30) / 20
    metrics.grossMarginPercent = normalized
    sum += normalized
    count++
  }

  if (econ?.landedCost !== undefined) {
    // Lower landed cost = better (inverse)
    const normalized = -logTransform(econ.landedCost) / 6
    metrics.landedCost = normalized
    sum += normalized
    count++
  }

  if (econ?.categoryReturnRate !== undefined) {
    // Lower return rate = better (inverse)
    const normalized = -(econ.categoryReturnRate / 10)
    metrics.categoryReturnRate = normalized
    sum += normalized
    count++
  }

  const zScore = count > 0 ? sum / count : 0
  return {
    score: zScoreToRating(zScore),
    zScore,
    metrics,
  }
}

// Compute Live Performance pillar (only for live products)
function computeLivePerformance(data: ProductForScoring): PillarScore | undefined {
  if (data.product.phase === 0) return undefined

  const perf = data.performance
  const metrics: Record<string, number> = {}
  let sum = 0
  let count = 0

  if (perf?.unitsSold !== undefined) {
    const normalized = logTransform(perf.unitsSold) / 8
    metrics.unitsSold = normalized
    sum += normalized
    count++
  }

  if (perf?.conversionRate !== undefined) {
    // Normalize around 2% baseline
    const normalized = (perf.conversionRate - 2) / 2
    metrics.conversionRate = normalized
    sum += normalized
    count++
  }

  if (perf?.repeatPurchaseRate !== undefined) {
    // Higher repeat = better
    const normalized = perf.repeatPurchaseRate / 10
    metrics.repeatPurchaseRate = normalized
    sum += normalized
    count++
  }

  if (perf?.discountDependency !== undefined) {
    // Lower discount dependency = better (inverse)
    const normalized = -(perf.discountDependency / 20)
    metrics.discountDependency = normalized
    sum += normalized
    count++
  }

  const zScore = count > 0 ? sum / count : 0
  return {
    score: zScoreToRating(zScore),
    zScore,
    metrics,
  }
}

// Compute confidence index
function computeConfidence(data: ProductForScoring): number {
  // Coverage factor: fraction of metrics available
  let totalMetrics = 0
  let availableMetrics = 0

  // External signals (7 metrics)
  const signals = data.externalSignals
  totalMetrics += 7
  if (signals?.searchVolume !== undefined) availableMetrics++
  if (signals?.searchTrendSlope !== undefined) availableMetrics++
  if (signals?.keywordIntentRatio !== undefined) availableMetrics++
  if (signals?.socialEngagementVelocity !== undefined) availableMetrics++
  if (signals?.competitorReviewDepth !== undefined) availableMetrics++
  if (signals?.cpcEstimate !== undefined) availableMetrics++
  if (signals?.sellerSaturation !== undefined) availableMetrics++

  // Economics (4 metrics)
  const econ = data.economics
  totalMetrics += 4
  if (econ?.grossMarginPercent !== undefined) availableMetrics++
  if (econ?.cogs !== undefined) availableMetrics++
  if (econ?.landedCost !== undefined) availableMetrics++
  if (econ?.categoryReturnRate !== undefined) availableMetrics++

  // Performance (only for live products)
  if (data.product.phase > 0) {
    const perf = data.performance
    totalMetrics += 5
    if (perf?.unitsSold !== undefined) availableMetrics++
    if (perf?.sessions !== undefined) availableMetrics++
    if (perf?.conversionRate !== undefined) availableMetrics++
    if (perf?.repeatPurchaseRate !== undefined) availableMetrics++
    if (perf?.discountDependency !== undefined) availableMetrics++
  }

  const coverage = totalMetrics > 0 ? availableMetrics / totalMetrics : 0

  // Sample strength (for live products)
  let sampleStrength = 1.0
  if (data.product.phase > 0 && data.performance) {
    const sessions = data.performance.sessions || 0
    const orders = data.performance.unitsSold || 0
    const sampleSize = Math.max(sessions, orders)
    // Saturation curve: approaches 1.0 as sample grows
    sampleStrength = Math.min(1.0, sampleSize / (sampleSize + 1000))
  }

  return Number((coverage * sampleStrength).toFixed(2))
}

// Determine status label based on CPR
function getStatusLabel(cpr: number): "Scale" | "Optimize" | "Test" | "Retire" {
  if (cpr >= 700) return "Scale"
  if (cpr >= 550) return "Optimize"
  if (cpr >= 400) return "Test"
  return "Retire"
}

// Main scoring function
export function computeRating(data: ProductForScoring): RatingSnapshot {
  const { product } = data

  // Compute pillar scores
  const demandVelocity = computeDemandVelocity(data)
  const redOceanPressure = computeRedOceanPressure(data)
  const unitEconomics = computeUnitEconomics(data)
  const livePerformance = computeLivePerformance(data)

  // Compute composite z-score
  const weights = product.phase === 0 ? PILLAR_WEIGHTS.idea : PILLAR_WEIGHTS.live
  let compositeZ =
    demandVelocity.zScore * weights.demandVelocity +
    redOceanPressure.zScore * weights.redOceanPressure +
    unitEconomics.zScore * weights.unitEconomics

  if (livePerformance) {
    compositeZ += livePerformance.zScore * weights.livePerformance
  }

  // Map to CPR
  const cpr = zScoreToRating(compositeZ)

  // Compute confidence
  const cci = computeConfidence(data)

  // Determine status label
  const statusLabel = getStatusLabel(cpr)

  return {
    id: `rating-${product.id}-${Date.now()}`,
    productId: product.id,
    cpr,
    cci,
    phase: product.phase,
    algoVersion: ALGO_VERSION,
    timestamp: new Date(),
    demandVelocity,
    redOceanPressure,
    unitEconomics,
    livePerformance,
    statusLabel,
  }
}
