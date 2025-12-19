import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ConfidenceIndicator } from '@/components/ConfidenceIndicator';
import { PillarCard } from '@/components/PillarCard';
import { RatingBadge } from '@/components/RatingBadge';
import { PhaseBadge } from '@/components/PhaseBadge';
import { MetricCard } from '@/components/MetricCard';
import { ScoreHistory } from '@/components/ScoreHistory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getMockProductById } from '@/lib/mock-data';
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getMockProductById(id || '');

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Return to Portfolio</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const rating = product.latestRating!;
  const { externalSignals, economics, performance } = product;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Button */}
        <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>

        {/* Product Header */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <PhaseBadge phase={product.phase} />
              <RatingBadge score={rating.nsr} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>Category: <span className="text-foreground">{product.category}</span></span>
              <span>Version: <span className="font-mono text-foreground">{rating.algoVersion}</span></span>
            </div>
          </div>

          {/* Score Summary */}
          <Card className="lg:w-80">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={rating.nsr} size="lg" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                    <ConfidenceIndicator value={rating.confidenceIndex} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
                    <RatingBadge score={rating.nsr} />
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full gap-2">
                <RefreshCw className="h-4 w-4" />
                Recalculate Score
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pillar Scores */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pillar Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PillarCard pillar="dv" score={rating.pillarScores.dv} />
            <PillarCard pillar="ro" score={rating.pillarScores.ro} />
            <PillarCard pillar="ue" score={rating.pillarScores.ue} />
            <PillarCard pillar="lp" score={rating.pillarScores.lp} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metrics Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* External Signals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">External Signals</CardTitle>
                <CardDescription>Market demand and competition metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <MetricCard
                    label="Search Volume"
                    value={externalSignals.searchVolume}
                    description="Monthly searches"
                  />
                  <MetricCard
                    label="Trend Slope"
                    value={externalSignals.searchTrendSlope?.toFixed(2)}
                    trend={externalSignals.searchTrendSlope && externalSignals.searchTrendSlope > 0 ? 'positive' : externalSignals.searchTrendSlope && externalSignals.searchTrendSlope < 0 ? 'negative' : 'neutral'}
                    description="Growth direction"
                  />
                  <MetricCard
                    label="Intent Ratio"
                    value={externalSignals.keywordIntentRatio ? `${Math.round(externalSignals.keywordIntentRatio * 100)}%` : null}
                    description="Commercial intent"
                  />
                  <MetricCard
                    label="Social Velocity"
                    value={externalSignals.socialEngagementVelocity}
                    description="Engagement rate"
                  />
                  <MetricCard
                    label="Competitor Reviews"
                    value={externalSignals.competitorReviewDepth}
                    trend={externalSignals.competitorReviewDepth && externalSignals.competitorReviewDepth > 500 ? 'negative' : 'neutral'}
                    description="Avg per competitor"
                  />
                  <MetricCard
                    label="CPC Estimate"
                    value={externalSignals.cpcEstimate?.toFixed(2)}
                    unit="$"
                    trend={externalSignals.cpcEstimate && externalSignals.cpcEstimate > 2 ? 'negative' : 'neutral'}
                    description="Cost per click"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Unit Economics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Unit Economics</CardTitle>
                <CardDescription>Profitability and cost metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard
                    label="Gross Margin"
                    value={economics.grossMarginPercent?.toFixed(1)}
                    unit="%"
                    trend={economics.grossMarginPercent && economics.grossMarginPercent > 40 ? 'positive' : economics.grossMarginPercent && economics.grossMarginPercent < 25 ? 'negative' : 'neutral'}
                    highlight={economics.grossMarginPercent && economics.grossMarginPercent > 50}
                  />
                  <MetricCard
                    label="COGS"
                    value={economics.cogs?.toFixed(2)}
                    unit="$"
                    description="Per unit"
                  />
                  <MetricCard
                    label="Landed Cost"
                    value={economics.landedCost?.toFixed(2)}
                    unit="$"
                    description="Total per unit"
                  />
                  <MetricCard
                    label="Return Rate"
                    value={economics.returnRate?.toFixed(1)}
                    unit="%"
                    trend={economics.returnRate && economics.returnRate > 15 ? 'negative' : economics.returnRate && economics.returnRate < 8 ? 'positive' : 'neutral'}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Performance */}
            {product.phase > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Performance</CardTitle>
                  <CardDescription>Real-world sales and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <MetricCard
                      label="Units Sold"
                      value={performance.recentUnitsSold}
                      description="Last 30 days"
                      trend={performance.recentUnitsSold && performance.recentUnitsSold > 100 ? 'positive' : 'neutral'}
                    />
                    <MetricCard
                      label="Sessions"
                      value={performance.sessions}
                      description="Total visits"
                    />
                    <MetricCard
                      label="Conversion"
                      value={performance.conversionRate?.toFixed(2)}
                      unit="%"
                      trend={performance.conversionRate && performance.conversionRate > 3 ? 'positive' : performance.conversionRate && performance.conversionRate < 2 ? 'negative' : 'neutral'}
                    />
                    <MetricCard
                      label="Repeat Rate"
                      value={performance.repeatPurchaseRate?.toFixed(1)}
                      unit="%"
                      trend={performance.repeatPurchaseRate && performance.repeatPurchaseRate > 20 ? 'positive' : 'neutral'}
                    />
                    <MetricCard
                      label="Discount Dependency"
                      value={performance.discountDependency?.toFixed(1)}
                      unit="%"
                      trend={performance.discountDependency && performance.discountDependency > 40 ? 'negative' : 'neutral'}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* History & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score History</CardTitle>
                <CardDescription>NSR trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreHistory history={product.ratingHistory} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View in Widget
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
