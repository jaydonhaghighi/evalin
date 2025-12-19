import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { ProductTable } from '@/components/ProductTable';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMockProducts } from '@/lib/mock-data';
import { getRatingLabel } from '@/types/product';
import { Rocket, Shield, FlaskConical, Archive, TrendingUp, AlertCircle } from 'lucide-react';

export default function Index() {
  const products = getMockProducts();

  const stats = useMemo(() => {
    const withRatings = products.filter(p => p.latestRating);
    const avgNSR = withRatings.reduce((sum, p) => sum + (p.latestRating?.nsr || 0), 0) / withRatings.length;
    const avgCI = withRatings.reduce((sum, p) => sum + (p.latestRating?.confidenceIndex || 0), 0) / withRatings.length;
    
    const labelCounts = { Scale: 0, Defend: 0, Test: 0, Retire: 0 };
    withRatings.forEach(p => {
      const label = getRatingLabel(p.latestRating!.nsr);
      labelCounts[label]++;
    });

    const lowConfidence = withRatings.filter(p => (p.latestRating?.confidenceIndex || 0) < 0.5).length;

    return { avgNSR: Math.round(avgNSR), avgCI, labelCounts, total: products.length, lowConfidence };
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and analyze your product portfolio performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average NSR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono">{stats.avgNSR}</span>
                <span className="text-sm text-muted-foreground">/ 900</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {stats.total} products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Label Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rating-scale-bg mx-auto">
                    <Rocket className="w-4 h-4 text-rating-scale" />
                  </div>
                  <p className="text-lg font-bold mt-1">{stats.labelCounts.Scale}</p>
                  <p className="text-[10px] text-muted-foreground">Scale</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rating-defend-bg mx-auto">
                    <Shield className="w-4 h-4 text-rating-defend" />
                  </div>
                  <p className="text-lg font-bold mt-1">{stats.labelCounts.Defend}</p>
                  <p className="text-[10px] text-muted-foreground">Defend</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rating-test-bg mx-auto">
                    <FlaskConical className="w-4 h-4 text-rating-test" />
                  </div>
                  <p className="text-lg font-bold mt-1">{stats.labelCounts.Test}</p>
                  <p className="text-[10px] text-muted-foreground">Test</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rating-retire-bg mx-auto">
                    <Archive className="w-4 h-4 text-rating-retire" />
                  </div>
                  <p className="text-lg font-bold mt-1">{stats.labelCounts.Retire}</p>
                  <p className="text-[10px] text-muted-foreground">Retire</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono">{Math.round(stats.avgCI * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${stats.avgCI * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <AlertCircle className="h-4 w-4 text-rating-retire" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono">{stats.lowConfidence}</span>
                <span className="text-sm text-muted-foreground">products</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Low confidence ratings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductTable products={products} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
