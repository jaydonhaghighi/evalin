import type React from "react"
import Link from "next/link"
import { ArrowLeft, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function APIPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg" />
            <span className="font-semibold text-xl">Evalin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/portfolio" className="text-sm text-slate-600 hover:text-slate-900">
              Portfolio
            </Link>
            <Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900">
              Docs
            </Link>
            <Link href="/api" className="text-sm text-slate-900 font-medium">
              API
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Evalin API</h1>
          </div>
          <p className="text-lg text-slate-600">
            Programmatic access to product ratings, pillar scores, and portfolio data.
          </p>
        </div>

        {/* API Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Overview</CardTitle>
            <CardDescription>RESTful API for product intelligence and scoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-500 mb-1">Base URL</div>
                <code className="text-sm font-mono text-slate-900">/api</code>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-500 mb-1">Version</div>
                <code className="text-sm font-mono text-slate-900">v1.0.0</code>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-500 mb-1">Format</div>
                <code className="text-sm font-mono text-slate-900">JSON</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Endpoints</h2>

          {/* GET /api/products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">List Products</CardTitle>
                <Badge className="bg-green-100 text-green-800 border-green-200">GET</Badge>
              </div>
              <CardDescription>Retrieve all products with their latest ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Endpoint</div>
                <code className="block bg-slate-900 text-green-400 p-3 rounded text-sm">GET /api/products</code>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Query Parameters</div>
                <div className="space-y-2">
                  <div className="flex gap-2 text-sm">
                    <code className="bg-slate-100 px-2 py-1 rounded text-slate-900">phase</code>
                    <span className="text-slate-600">Filter by phase (0, 1, or 2)</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <code className="bg-slate-100 px-2 py-1 rounded text-slate-900">status</code>
                    <span className="text-slate-600">Filter by status (Scale, Optimize, Test, Retire)</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <code className="bg-slate-100 px-2 py-1 rounded text-slate-900">limit</code>
                    <span className="text-slate-600">Limit number of results</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Example Request</div>
                <code className="block bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                  curl https://Evalin.dev/api/products?phase=2&limit=10
                </code>
              </div>
            </CardContent>
          </Card>

          {/* GET /api/products/:id */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Get Product Details</CardTitle>
                <Badge className="bg-green-100 text-green-800 border-green-200">GET</Badge>
              </div>
              <CardDescription>Retrieve detailed product information including full pillar breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Endpoint</div>
                <code className="block bg-slate-900 text-green-400 p-3 rounded text-sm">GET /api/products/:id</code>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Response Includes</div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Complete product information</li>
                  <li>• CPR and CCI scores</li>
                  <li>• All four pillar scores with z-scores and contributing metrics</li>
                  <li>• External signals, economics, and performance data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* POST /api/products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Create Product</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">POST</Badge>
              </div>
              <CardDescription>Create a new product and trigger rating calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Endpoint</div>
                <code className="block bg-slate-900 text-blue-400 p-3 rounded text-sm">POST /api/products</code>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Required Fields</div>
                <div className="space-y-2">
                  <div className="flex gap-2 text-sm">
                    <code className="bg-slate-100 px-2 py-1 rounded text-slate-900">name</code>
                    <span className="text-slate-600">Product name (string)</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <code className="bg-slate-100 px-2 py-1 rounded text-slate-900">category</code>
                    <span className="text-slate-600">Product category (string)</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <code className="bg-slate-100 px-2 py-1 rounded text-slate-900">phase</code>
                    <span className="text-slate-600">Product phase: 0, 1, or 2 (number)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GET /api/products/:id/rating-history */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Rating History</CardTitle>
                <Badge className="bg-green-100 text-green-800 border-green-200">GET</Badge>
              </div>
              <CardDescription>Retrieve historical ratings to track changes over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Endpoint</div>
                <code className="block bg-slate-900 text-green-400 p-3 rounded text-sm">
                  GET /api/products/:id/rating-history
                </code>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Use Cases</div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Track CPR changes over time</li>
                  <li>• Monitor confidence index evolution</li>
                  <li>• Analyze pillar score trends</li>
                  <li>• Audit algorithm version transitions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating System Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Rating System Reference</CardTitle>
            <CardDescription>Understanding the Evalin Product Rating (CPR)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Rating Scale</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Range:</span>
                    <code className="text-slate-900">300 - 900</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Scale (700+):</span>
                    <span className="text-green-700 font-medium">Strong</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Optimize (550-699):</span>
                    <span className="text-blue-700 font-medium">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Test (400-549):</span>
                    <span className="text-yellow-700 font-medium">Mixed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Retire (&lt;400):</span>
                    <span className="text-red-700 font-medium">Weak</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Four Pillars</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <strong className="text-slate-900">Demand Velocity:</strong> External demand signals
                  </li>
                  <li>
                    <strong className="text-slate-900">Red Ocean Pressure:</strong> Competition intensity
                  </li>
                  <li>
                    <strong className="text-slate-900">Unit Economics:</strong> Margins and costs
                  </li>
                  <li>
                    <strong className="text-slate-900">Live Performance:</strong> Sales and conversion (live only)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}
