import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { PillarCard } from "@/components/PillarCard";
import { ScoreGauge } from "@/components/ScoreGauge";
import { ScoreHistory } from "@/components/ScoreHistory";
import type { RatingSnapshot } from "@/types/product";
import { ArrowRight } from "lucide-react";

const SAMPLE_HISTORY: RatingSnapshot[] = [
  {
    id: "r0",
    productId: "p1",
    nsr: 460,
    confidenceIndex: 0.52,
    pillarScores: { dv: 610, ro: 610, ue: 560, lp: 575 },
    pillarZScores: { dv: 0.05, ro: 0.02, ue: -0.08, lp: -0.02 },
    phase: 2,
    algoVersion: "v1.8",
    timestamp: "2025-05-15T00:00:00.000Z",
  },
  {
    id: "r1",
    productId: "p1",
    nsr: 612,
    confidenceIndex: 0.58,
    pillarScores: { dv: 640, ro: 520, ue: 590, lp: 610 },
    pillarZScores: { dv: 0.1, ro: -0.1, ue: 0.0, lp: 0.05 },
    phase: 2,
    algoVersion: "v1.8",
    timestamp: "2025-06-01T00:00:00.000Z",
  },
  {
    id: "r2",
    productId: "p1",
    nsr: 645,
    confidenceIndex: 0.61,
    pillarScores: { dv: 668, ro: 540, ue: 605, lp: 640 },
    pillarZScores: { dv: 0.15, ro: -0.05, ue: 0.03, lp: 0.12 },
    phase: 2,
    algoVersion: "v1.8",
    timestamp: "2025-06-15T00:00:00.000Z",
  },
  {
    id: "r3",
    productId: "p1",
    nsr: 622,
    confidenceIndex: 0.59,
    pillarScores: { dv: 652, ro: 510, ue: 592, lp: 628 },
    pillarZScores: { dv: 0.12, ro: -0.12, ue: 0.01, lp: 0.07 },
    phase: 2,
    algoVersion: "v1.8",
    timestamp: "2025-07-01T00:00:00.000Z",
  },
  {
    id: "r4",
    productId: "p1",
    nsr: 780,
    confidenceIndex: 0.64,
    pillarScores: { dv: 690, ro: 548, ue: 620, lp: 660 },
    pillarZScores: { dv: 0.2, ro: -0.03, ue: 0.07, lp: 0.16 },
    phase: 2,
    algoVersion: "v1.8",
    timestamp: "2025-07-15T00:00:00.000Z",
  },
  {
    id: "r5",
    productId: "p1",
    nsr: 740,
    confidenceIndex: 0.62,
    pillarScores: { dv: 682, ro: 535, ue: 615, lp: 650 },
    pillarZScores: { dv: 0.18, ro: -0.06, ue: 0.05, lp: 0.14 },
    phase: 2,
    algoVersion: "v1.8",
    timestamp: "2025-08-01T00:00:00.000Z",
  },
];

function Divider() {
  return <div className="border-t border-slate-200/70" />;
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            How Evalin works
          </h1>

          <div className="mt-10">
            <Divider />
          </div>

          {/* Rating layer */}
          <section className="pt-10 md:pt-12">
            <h2 className="text-lg font-semibold text-slate-900">
              A rating layer for your product portfolio.
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-3xl">
              Every product is scored by category and phase (idea, early live, or mature live). Evalin then assigns a
              300–900 rating plus a Confidence Index, so teams can decide: enter, scale, fix, or retire.
            </p>

            <ul className="mt-5 text-sm text-slate-600 space-y-2 max-w-3xl list-disc pl-5">
              <li>One standardized rating per product — consistent across your portfolio.</li>
              <li>Four pillars (Demand, Competition, Unit Economics, Live Performance) explain the score.</li>
              <li>A Confidence Index (0.00–1.00) shows how strong the signal is.</li>
            </ul>

            <div className="mt-8">
              <Card className="border-slate-200/70">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-rating-scale/10 text-rating-scale border border-rating-scale/20 hover:bg-rating-scale/10">
                          Mature Live
                        </Badge>
                        <span className="text-xs text-slate-500">Category: Health &amp; Wellness</span>
                        <span className="text-xs text-slate-500">Version: v1.8</span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-slate-900">Bluetooth Speaker Mini</h3>
                      <p className="mt-2 text-sm text-slate-600 max-w-xl">
                        A high-quality product designed for modern consumers. Evalin compresses dozens of signals into one
                        rating and a clear breakdown you can act on.
                      </p>
                      <p className="mt-4 text-sm text-slate-600 max-w-xl">
                        This compression produces a recommendation such as <span className="font-medium">Scale</span>,{" "}
                        <span className="font-medium">Defend</span>, <span className="font-medium">Test</span>, or{" "}
                        <span className="font-medium">Retire</span>. The rating is shared across the org to standardize
                        portfolio decisions.
                      </p>
                    </div>

                    <Card className="w-full md:w-[260px] border-slate-200/70">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <ScoreGauge score={635} size="sm" />
                          <div className="flex-1 pl-4 space-y-3">
                            <div>
                              <p className="text-xs text-slate-500">Confidence</p>
                              <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-rating-scale transition-all duration-700" style={{ width: "64%" }} />
                              </div>
                              <p className="mt-1 text-xs text-slate-500">0.64</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Recommendation</p>
                              <p className="text-sm font-semibold text-slate-900">Defend</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="mt-12">
            <Divider />
          </div>

          {/* Pillar breakdown */}
          <section className="pt-10 md:pt-12">
            <h2 className="text-lg font-semibold text-slate-900">Pillar breakdown</h2>
            <p className="mt-3 text-sm text-slate-600 max-w-3xl">
              The rating is built from four pillars. Each pillar is normalized to the same 300–900 scale.
            </p>

            <ul className="mt-5 text-sm text-slate-600 space-y-2 max-w-3xl list-disc pl-5">
              <li>
                <span className="font-medium">Demand Velocity</span> — market intent and growth trends
              </li>
              <li>
                <span className="font-medium">Red Ocean Pressure</span> — competition intensity and ad pressure
              </li>
              <li>
                <span className="font-medium">Unit Economics</span> — profitability and return risk
              </li>
              <li>
                <span className="font-medium">Live Performance</span> — real-world sales and engagement signals
              </li>
            </ul>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <PillarCard pillar="dv" score={868} iconBackground={false} showDescription={false} />
              <PillarCard pillar="ro" score={328} iconBackground={false} showDescription={false} />
              <PillarCard pillar="ue" score={391} iconBackground={false} showDescription={false} />
              <PillarCard pillar="lp" score={886} iconBackground={false} showDescription={false} />
            </div>

            <p className="mt-4 text-xs text-slate-500 max-w-3xl">
              Pillar scores summarize strength and weakness, helping you understand what drives the rating and what to
              improve.
            </p>
          </section>

          <div className="mt-12">
            <Divider />
          </div>

          {/* External signals */}
          <section className="pt-10 md:pt-12">
            <h2 className="text-lg font-semibold text-slate-900">External signals</h2>
            <p className="mt-3 text-sm text-slate-600 max-w-3xl">
              Evalin measures demand and competition from search trends, social velocity, and marketplace pressure.
            </p>

            <Card className="mt-8 border-slate-200/70">
              <CardHeader>
                <CardTitle className="text-base">External Signals</CardTitle>
                <CardDescription>Market demand and competition metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricCard label="Search Volume" value={27279} description="Monthly searches" />
                  <MetricCard label="Trend Slope" value={0.68} description="Growth direction" trend="positive" />
                  <MetricCard label="Intent Ratio" value={47} unit="%" description="Commercial intent" />
                  <MetricCard label="Social Velocity" value={2435} description="Engagement rate" trend="positive" />
                  <MetricCard label="Competitor Reviews" value={466} description="Avg per competitor" />
                  <MetricCard label="CPC Estimate" value={0.53} unit="$" description="Cost per click" />
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="mt-12">
            <Divider />
          </div>

          {/* Unit economics */}
          <section className="pt-10 md:pt-12">
            <h2 className="text-lg font-semibold text-slate-900">Unit economics</h2>
            <p className="mt-3 text-sm text-slate-600 max-w-3xl">
              Returns, landed cost, and gross margin can make or break a product even when demand is strong.
            </p>

            <Card className="mt-8 border-slate-200/70">
              <CardHeader>
                <CardTitle className="text-base">Unit Economics</CardTitle>
                <CardDescription>Profitability and cost metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard label="Gross Margin" value={59.5} unit="%" trend="positive" highlight />
                  <MetricCard label="COGS" value={26.9} unit="$" description="Per unit" />
                  <MetricCard label="Landed Cost" value={10.68} unit="$" description="Total per unit" />
                  <MetricCard label="Return Rate" value={11.0} unit="%" trend="neutral" />
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="mt-12">
            <Divider />
          </div>

          {/* Live performance */}
          <section className="pt-10 md:pt-12">
            <h2 className="text-lg font-semibold text-slate-900">Live performance</h2>
            <p className="mt-3 text-sm text-slate-600 max-w-3xl">
              Once a product is live, Evalin pulls performance signals like conversion, repeat purchase, and discount
              behavior into the rating.
            </p>

            <Card className="mt-8 border-slate-200/70">
              <CardHeader>
                <CardTitle className="text-base">Live Performance</CardTitle>
                <CardDescription>Real-world sales and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <MetricCard label="Units Sold" value={445} description="Last 30 days" trend="positive" />
                  <MetricCard label="Sessions" value={8843} description="Total visits" />
                  <MetricCard label="Conversion" value={7.72} unit="%" trend="positive" />
                  <MetricCard label="Repeat Rate" value={30.8} unit="%" trend="positive" />
                  <MetricCard label="Discount Dependency" value={18.4} unit="%" trend="neutral" />
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="mt-12">
            <Divider />
          </div>

          {/* Score history */}
          <section className="pt-10 md:pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Score history</h2>
                <p className="mt-3 text-sm text-slate-600 max-w-prose">
                  Products evolve as they mature. Score history tracks how ratings and confidence shift as market
                  conditions and real-world performance changes.
                </p>
              </div>

              <Card className="border-slate-200/70">
                <CardHeader>
                  <CardTitle className="text-base">Score History</CardTitle>
                  <CardDescription>NSR trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScoreHistory history={SAMPLE_HISTORY} />
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="mt-12">
            <Divider />
          </div>

          {/* Actions & workflow */}
          <section className="pt-10 md:pt-12 pb-6">
            <h2 className="text-lg font-semibold text-slate-900">Actions &amp; workflow</h2>
            <p className="mt-3 text-sm text-slate-600 max-w-3xl">
              Evalin turns a messy signal layer into a standardized rating and an actionable next step for each product.
            </p>

            <ul className="mt-6 text-sm text-slate-600 space-y-2 max-w-3xl list-disc pl-5">
              <li>Access your portfolio in one place with standardized scores.</li>
              <li>Understand what drives the rating via pillar breakdowns and metrics.</li>
              <li>Export insights to inform launch plans and weekly operating reviews.</li>
            </ul>

            <p className="mt-4 text-sm text-slate-600 max-w-3xl">
              This workflow ensures every product has a defensible rating and a concrete next step for buying decisions
              and roadmap reviews.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

