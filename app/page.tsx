import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg" />
            <span className="font-semibold text-xl">Cohorent</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/portfolio" className="text-sm text-slate-600 hover:text-slate-900">
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

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 text-balance">
            Product ratings built on your data, not gut feel.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 text-pretty max-w-3xl mx-auto">
            Cohorent ingests demand signals, competitive benchmarks, unit economics, and live performance to generate a
            300–900 product rating with confidence, so commercial, product, and data teams can make the same decision
            from the same number.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href="/portfolio">
                View Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
              <Link href="/sample-report">View Sample Report</Link>
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            For e-commerce brands, marketplaces, and product-led teams that want a repeatable, data-driven way to decide
            what to launch, scale, optimize, or retire.
          </p>
        </div>
      </section>

      {/* What Cohorent Is */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-center">
            A rating layer for your product portfolio.
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              Cohorent is a product intelligence and scoring platform. It connects to your commerce stack, overlays
              external market data, and produces a standardized{" "}
              <span className="font-semibold text-slate-900">Cohorent Product Rating (CPR)</span> between 300 and 900
              for every product and feature.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {[
              {
                title: "Demand Velocity",
                description: "External demand and intent signals",
              },
              {
                title: "Red Ocean Pressure",
                description: "Competitive and advertising intensity",
              },
              {
                title: "Unit Economics",
                description: "Margins, landed cost, and return risk",
              },
              {
                title: "Live Performance",
                description: "Sales, conversion, retention, and discount dependency",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="border rounded-lg p-6 bg-white">
                <h3 className="font-semibold text-slate-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-600">{pillar.description}</p>
              </div>
            ))}
          </div>

          <p className="text-slate-600 mt-8 text-center">
            Every CPR is accompanied by a{" "}
            <span className="font-semibold text-slate-900">confidence index (0.00–1.00)</span> and a phase tag (idea,
            early live, mature), so stakeholders always know both how strong the signal is and how much to trust it.
          </p>
        </div>
      </section>

      {/* Example Snapshot */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">
            Example: mature product inside Cohorent
          </h2>
          <div className="border-2 border-blue-200 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Portable Espresso Maker</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Scale
                  </span>
                  <span className="text-sm text-slate-500">Phase 2 – Mature</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-sm text-slate-500 mb-1">Cohorent Product Rating</div>
                <div className="text-5xl font-bold text-slate-900">784</div>
                <div className="text-sm text-slate-500 mt-1">Confidence: 0.86</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Demand Velocity",
                  score: 812,
                  description: "Strong, sustained external interest",
                },
                {
                  name: "Red Ocean Pressure",
                  score: 735,
                  description: "Active competition, but not prohibitive",
                },
                {
                  name: "Unit Economics",
                  score: 790,
                  description: "Solid margins after landed costs and returns",
                },
                {
                  name: "Live Performance",
                  score: 760,
                  description: "Healthy sales velocity and conversion",
                },
              ].map((pillar) => (
                <div key={pillar.name} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{pillar.name}</span>
                    <span className="text-lg font-bold text-slate-900">{pillar.score}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: `${((pillar.score - 300) / 600) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">{pillar.description}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-600 mt-6 italic">
              Interpretation: This SKU supports additional acquisition spend and channel expansion. Monitor CPC
              inflation, but economics and demand are currently robust.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Turn product decisions into a reusable rating.
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Cohorent gives you a statistically grounded, versioned rating system for products and features—so your
            organization can talk about portfolio health and potential in the same language, from data engineering to
            the boardroom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/portfolio">
                Explore Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded" />
              <span className="font-semibold">Cohorent</span>
            </div>
            <p className="text-sm text-slate-500">Product intelligence and scoring platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
