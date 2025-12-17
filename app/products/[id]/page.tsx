"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateMockProducts } from "@/lib/mock-data"
import { computeRating } from "@/lib/scoring-engine"
import type { ProductPhase, PillarScore } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params)

  // Find product and compute rating
  const products = generateMockProducts()
  const productData = products.find((p) => p.product.id === id)

  if (!productData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/portfolio">Back to Portfolio</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { product, externalSignals, economics, performance } = productData
  const rating = computeRating(productData)

  const getPhaseLabel = (phase: ProductPhase) => {
    switch (phase) {
      case 0:
        return "Idea"
      case 1:
        return "Early Live"
      case 2:
        return "Mature Live"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scale":
        return "bg-green-100 text-green-800 border-green-200"
      case "Optimize":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Test":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Retire":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getCPRColor = (cpr: number) => {
    if (cpr >= 700) return "text-green-700"
    if (cpr >= 550) return "text-blue-700"
    if (cpr >= 400) return "text-yellow-700"
    return "text-red-700"
  }

  const formatMetricValue = (value: number | undefined, type: "number" | "percent" | "currency" = "number") => {
    if (value === undefined) return "N/A"
    switch (type) {
      case "percent":
        return `${value.toFixed(1)}%`
      case "currency":
        return `$${value.toFixed(2)}`
      default:
        return value.toLocaleString()
    }
  }

  const MetricTrend = ({ value }: { value: number }) => {
    if (value > 0.5) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (value < -0.5) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-slate-400" />
  }

  const PillarCard = ({
    title,
    pillar,
    metrics,
  }: {
    title: string
    pillar: PillarScore
    metrics: Array<{ label: string; value: string; impact: "positive" | "negative" | "neutral" }>
  }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className={`text-3xl font-bold ${getCPRColor(pillar.score)}`}>{pillar.score}</div>
        </div>
        <CardDescription>Z-Score: {pillar.zScore.toFixed(3)}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              style={{ width: `${((pillar.score - 300) / 600) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>300</span>
            <span>600</span>
            <span>900</span>
          </div>
        </div>

        {/* Contributing metrics */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700 mb-3">Contributing Metrics</div>
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded">
              <span className="text-sm text-slate-600">{metric.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">{metric.value}</span>
                {metric.impact === "positive" && (
                  <TrendingUp className="h-3 w-3 text-green-600" title="Positive impact" />
                )}
                {metric.impact === "negative" && (
                  <TrendingDown className="h-3 w-3 text-red-600" title="Negative impact" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg" />
            <span className="font-semibold text-xl">Cohorent</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/portfolio" className="text-sm text-slate-900 font-medium">
              Portfolio
            </Link>
            <Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900">
              Docs
            </Link>
            <Link href="/api" className="text-sm text-slate-600 hover:text-slate-900">
              API
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>

        {/* Product Header */}
        <div className="bg-white rounded-lg border p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
              <p className="text-slate-600 mb-4">{product.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{getPhaseLabel(product.phase)}</Badge>
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-slate-500">
                Created: {product.createdAt.toLocaleDateString()} | Updated: {product.updatedAt.toLocaleDateString()}
              </div>
            </div>

            {/* Rating Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 min-w-[280px]">
              <div className="text-sm text-slate-600 mb-1">Cohorent Product Rating</div>
              <div className={`text-6xl font-bold mb-2 ${getCPRColor(rating.cpr)}`}>{rating.cpr}</div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">Confidence Index</span>
                <span className="text-lg font-semibold text-slate-900">{rating.cci.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${
                    rating.cci >= 0.7 ? "bg-green-500" : rating.cci >= 0.5 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${rating.cci * 100}%` }}
                />
              </div>
              <Badge className={`${getStatusColor(rating.statusLabel)} text-base px-4 py-1`}>
                {rating.statusLabel}
              </Badge>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500">
                  Algorithm: {rating.algoVersion} | {rating.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar Breakdown */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pillar Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Demand Velocity */}
            <PillarCard
              title="Demand Velocity"
              pillar={rating.demandVelocity}
              metrics={[
                {
                  label: "Search Volume",
                  value: formatMetricValue(externalSignals?.searchVolume),
                  impact: "positive",
                },
                {
                  label: "Search Trend",
                  value: formatMetricValue(externalSignals?.searchTrendSlope, "number"),
                  impact: (externalSignals?.searchTrendSlope ?? 0) > 0 ? "positive" : "negative",
                },
                {
                  label: "Commercial Intent",
                  value: formatMetricValue(
                    externalSignals?.keywordIntentRatio && externalSignals.keywordIntentRatio * 100,
                    "percent",
                  ),
                  impact: "positive",
                },
                {
                  label: "Social Engagement",
                  value: formatMetricValue(externalSignals?.socialEngagementVelocity),
                  impact: "positive",
                },
              ]}
            />

            {/* Red Ocean Pressure */}
            <PillarCard
              title="Red Ocean Pressure"
              pillar={rating.redOceanPressure}
              metrics={[
                {
                  label: "Competitor Reviews",
                  value: formatMetricValue(externalSignals?.competitorReviewDepth),
                  impact: "negative",
                },
                {
                  label: "CPC Estimate",
                  value: formatMetricValue(externalSignals?.cpcEstimate, "currency"),
                  impact: "negative",
                },
                {
                  label: "Seller Saturation",
                  value: formatMetricValue(externalSignals?.sellerSaturation),
                  impact: "negative",
                },
              ]}
            />

            {/* Unit Economics */}
            <PillarCard
              title="Unit Economics"
              pillar={rating.unitEconomics}
              metrics={[
                {
                  label: "Gross Margin",
                  value: formatMetricValue(economics?.grossMarginPercent, "percent"),
                  impact: "positive",
                },
                {
                  label: "COGS",
                  value: formatMetricValue(economics?.cogs, "currency"),
                  impact: "neutral",
                },
                {
                  label: "Landed Cost",
                  value: formatMetricValue(economics?.landedCost, "currency"),
                  impact: "negative",
                },
                {
                  label: "Return Rate",
                  value: formatMetricValue(economics?.categoryReturnRate, "percent"),
                  impact: "negative",
                },
              ]}
            />

            {/* Live Performance */}
            {rating.livePerformance && performance && (
              <PillarCard
                title="Live Performance"
                pillar={rating.livePerformance}
                metrics={[
                  {
                    label: "Units Sold",
                    value: formatMetricValue(performance.unitsSold),
                    impact: "positive",
                  },
                  {
                    label: "Sessions",
                    value: formatMetricValue(performance.sessions),
                    impact: "positive",
                  },
                  {
                    label: "Conversion Rate",
                    value: formatMetricValue(performance.conversionRate, "percent"),
                    impact: "positive",
                  },
                  {
                    label: "Repeat Purchase",
                    value: formatMetricValue(performance.repeatPurchaseRate, "percent"),
                    impact: "positive",
                  },
                  {
                    label: "Discount Dependency",
                    value: formatMetricValue(performance.discountDependency, "percent"),
                    impact: "negative",
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Interpretation */}
        <Card>
          <CardHeader>
            <CardTitle>Interpretation & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rating.cpr >= 700 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Strong Performance - Scale Recommended</h3>
                  <p className="text-sm text-green-800">
                    This product demonstrates strong fundamentals across all pillars. Consider increasing acquisition
                    spend, expanding to new channels, and investing in inventory. Monitor competitive dynamics and
                    maintain healthy unit economics as you scale.
                  </p>
                </div>
              )}

              {rating.cpr >= 550 && rating.cpr < 700 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Solid Product - Optimize for Growth</h3>
                  <p className="text-sm text-blue-800">
                    This product shows good potential but has room for improvement. Focus on optimizing the
                    lower-performing pillars. Consider A/B testing pricing, improving conversion rates, or reducing
                    costs to strengthen overall performance.
                  </p>
                </div>
              )}

              {rating.cpr >= 400 && rating.cpr < 550 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Uncertain Performance - Test & Learn</h3>
                  <p className="text-sm text-yellow-800">
                    This product has mixed signals. Run controlled experiments to validate demand, optimize economics,
                    or improve competitive positioning. Consider limited marketing spend while gathering more data to
                    increase confidence.
                  </p>
                </div>
              )}

              {rating.cpr < 400 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Weak Performance - Consider Retiring</h3>
                  <p className="text-sm text-red-800">
                    This product faces significant challenges across multiple dimensions. Evaluate whether fundamental
                    improvements are possible or if resources would be better allocated elsewhere. Consider phasing out
                    unless strategic reasons justify continued investment.
                  </p>
                </div>
              )}

              {rating.cci < 0.6 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">Low Confidence Warning</h3>
                  <p className="text-sm text-slate-700">
                    The confidence index for this rating is below 0.60, indicating incomplete data or limited sample
                    size. Collect more performance data and fill in missing metrics before making major decisions based
                    on this rating.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
