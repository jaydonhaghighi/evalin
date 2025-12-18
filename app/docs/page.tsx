import type React from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, CheckCircle2, Server, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocsPage() {
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
            <Link href="/docs" className="text-sm text-slate-900 font-medium">
              Docs
            </Link>
            <Link href="/api" className="text-sm text-slate-600 hover:text-slate-900">
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

        <div className="mb-8 flex items-start gap-3">
          <BookOpen className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Evalin Docs</h1>
            <p className="text-lg text-slate-600">
              Understand how to evaluate products, interpret scores, and integrate with the API.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <InfoTile title="What is Evalin?" body="A product intelligence layer that scores products using four pillars: demand, competition, unit economics, and live performance." />
          <InfoTile title="Who uses it?" body="Operators, PMs, and analysts tracking product-market fit, prioritization, and health." />
          <InfoTile title="How to consume it?" body="Browse the app UI or pull data via REST endpoints under /api." />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quickstart</CardTitle>
              <CardDescription>Get value in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Step text="Create or import products in the app." />
              <Step text="Review CPR and pillar scores; filter by phase/status." />
              <Step text="Drill into product details and rating history." />
              <Step text="Call the API for automation (see API page)." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Core Concepts</CardTitle>
              <CardDescription>How Evalin scores products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Concept
                title="CPR (Evalin Product Rating)"
                body="Aggregate score (300–900). 700+ is strong, 550–699 is optimize, 400–549 is test, below 400 is retire."
              />
              <Concept
                title="Four Pillars"
                body="Demand Velocity, Red Ocean Pressure, Unit Economics, Live Performance."
              />
              <Concept
                title="Confidence Index (CCI)"
                body="Signals confidence in the CPR based on data freshness and coverage."
              />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Overview</CardTitle>
            <CardDescription>REST endpoints for products and ratings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Server className="h-4 w-4 text-blue-600" />
              <span>Base URL: </span>
              <code className="bg-slate-900 text-slate-200 px-2 py-1 rounded text-xs">/api</code>
            </div>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>• <span className="font-medium text-slate-900">GET</span> /api/products — list products with latest scores</li>
              <li>• <span className="font-medium text-slate-900">GET</span> /api/products/:id — detailed CPR and pillar breakdown</li>
              <li>• <span className="font-medium text-slate-900">POST</span> /api/products — create a product and trigger scoring</li>
              <li>• <span className="font-medium text-slate-900">GET</span> /api/products/:id/rating-history — historical scores</li>
            </ul>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/api">View full API reference</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Example Workflow</CardTitle>
            <CardDescription>How teams typically use Evalin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <WorkflowItem
              title="Prioritize pipeline"
              body="Score candidate products, then move forward with those above 700 CPR or strong demand velocity."
            />
            <WorkflowItem
              title="Monitor live performance"
              body="Track CPR + CCI weekly; investigate drops in specific pillars like Unit Economics."
            />
            <WorkflowItem
              title="Automate reporting"
              body="Pull product scores via the API and push into BI dashboards or alerts."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function InfoTile({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="text-sm text-slate-600 mt-2">{body}</p>
    </div>
  )
}

function Step({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-slate-700">
      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
      <span>{text}</span>
    </div>
  )
}

function Concept({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="text-sm text-slate-600 mt-1">{body}</p>
    </div>
  )
}

function WorkflowItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <Workflow className="h-5 w-5 text-blue-600 mt-0.5" />
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <p className="text-sm text-slate-600">{body}</p>
      </div>
    </div>
  )
}
