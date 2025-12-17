"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProductPhase } from "@/lib/types"

export default function NewProductPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<ProductPhase>(0)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In a real app, this would save to a database
    // For now, redirect back to portfolio
    alert("Product created successfully! (Demo mode)")
    router.push("/portfolio")
  }

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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Product</h1>
          <p className="text-slate-600">Enter product information and metrics to generate a Evalin Product Rating.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core product details and classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" placeholder="e.g., Portable Espresso Maker" required />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the product"
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input id="category" name="category" placeholder="e.g., Kitchen & Dining" required />
                </div>

                <div>
                  <Label htmlFor="phase">Phase *</Label>
                  <Select value={phase.toString()} onValueChange={(v) => setPhase(Number.parseInt(v) as ProductPhase)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Idea (Phase 0)</SelectItem>
                      <SelectItem value="1">Early Live (Phase 1)</SelectItem>
                      <SelectItem value="2">Mature Live (Phase 2)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    {phase === 0 && "Product concept with no sales history"}
                    {phase === 1 && "Recently launched with limited data"}
                    {phase === 2 && "Established product with rich history"}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag..."
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* External Signals */}
          <Card>
            <CardHeader>
              <CardTitle>External Signals (Demand & Competition)</CardTitle>
              <CardDescription>Market demand and competitive metrics - leave blank if unknown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="searchVolume">Search Volume (monthly)</Label>
                  <Input id="searchVolume" name="searchVolume" type="number" placeholder="e.g., 45000" />
                </div>

                <div>
                  <Label htmlFor="searchTrendSlope">Search Trend Slope (-1 to 1)</Label>
                  <Input
                    id="searchTrendSlope"
                    name="searchTrendSlope"
                    type="number"
                    step="0.01"
                    min="-1"
                    max="1"
                    placeholder="e.g., 0.35"
                  />
                  <p className="text-xs text-slate-500 mt-1">Positive = growing, Negative = declining</p>
                </div>

                <div>
                  <Label htmlFor="keywordIntentRatio">Keyword Intent Ratio (0 to 1)</Label>
                  <Input
                    id="keywordIntentRatio"
                    name="keywordIntentRatio"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="e.g., 0.72"
                  />
                  <p className="text-xs text-slate-500 mt-1">Higher = more commercial intent</p>
                </div>

                <div>
                  <Label htmlFor="socialEngagementVelocity">Social Engagement Velocity</Label>
                  <Input
                    id="socialEngagementVelocity"
                    name="socialEngagementVelocity"
                    type="number"
                    placeholder="e.g., 850"
                  />
                </div>

                <div>
                  <Label htmlFor="competitorReviewDepth">Competitor Review Depth</Label>
                  <Input
                    id="competitorReviewDepth"
                    name="competitorReviewDepth"
                    type="number"
                    placeholder="e.g., 1200"
                  />
                  <p className="text-xs text-slate-500 mt-1">Average review count for competitors</p>
                </div>

                <div>
                  <Label htmlFor="cpcEstimate">CPC Estimate ($)</Label>
                  <Input id="cpcEstimate" name="cpcEstimate" type="number" step="0.01" placeholder="e.g., 2.80" />
                </div>

                <div>
                  <Label htmlFor="sellerSaturation">Seller Saturation</Label>
                  <Input id="sellerSaturation" name="sellerSaturation" type="number" placeholder="e.g., 15" />
                  <p className="text-xs text-slate-500 mt-1">Number of sellers per unit demand</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unit Economics */}
          <Card>
            <CardHeader>
              <CardTitle>Unit Economics</CardTitle>
              <CardDescription>Cost structure and margin metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grossMarginPercent">Gross Margin (%)</Label>
                  <Input
                    id="grossMarginPercent"
                    name="grossMarginPercent"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 52"
                  />
                </div>

                <div>
                  <Label htmlFor="cogs">COGS ($)</Label>
                  <Input id="cogs" name="cogs" type="number" step="0.01" placeholder="e.g., 28.00" />
                </div>

                <div>
                  <Label htmlFor="landedCost">Landed Cost ($)</Label>
                  <Input id="landedCost" name="landedCost" type="number" step="0.01" placeholder="e.g., 35.00" />
                  <p className="text-xs text-slate-500 mt-1">Total cost including shipping and duties</p>
                </div>

                <div>
                  <Label htmlFor="categoryReturnRate">Category Return Rate (%)</Label>
                  <Input
                    id="categoryReturnRate"
                    name="categoryReturnRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Performance - only for Phase 1 & 2 */}
          {phase > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Live Performance</CardTitle>
                <CardDescription>Sales and conversion metrics for live products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unitsSold">Units Sold (recent period)</Label>
                    <Input id="unitsSold" name="unitsSold" type="number" placeholder="e.g., 3800" />
                  </div>

                  <div>
                    <Label htmlFor="sessions">Sessions (recent period)</Label>
                    <Input id="sessions" name="sessions" type="number" placeholder="e.g., 58000" />
                  </div>

                  <div>
                    <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
                    <Input id="conversionRate" name="conversionRate" type="number" step="0.1" placeholder="e.g., 6.5" />
                  </div>

                  <div>
                    <Label htmlFor="repeatPurchaseRate">Repeat Purchase Rate (%)</Label>
                    <Input
                      id="repeatPurchaseRate"
                      name="repeatPurchaseRate"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 18"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountDependency">Discount Dependency (%)</Label>
                    <Input
                      id="discountDependency"
                      name="discountDependency"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 15"
                    />
                    <p className="text-xs text-slate-500 mt-1">% of sales requiring discounts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1">
              Create Product & Calculate Rating
            </Button>
            <Button type="button" variant="outline" size="lg" asChild>
              <Link href="/portfolio">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
