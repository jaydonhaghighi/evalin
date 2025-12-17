"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateMockProducts } from "@/lib/mock-data"
import { computeRating } from "@/lib/scoring-engine"
import type { RatingSnapshot, ProductPhase } from "@/lib/types"
import { AddProductButton } from "@/components/add-product-button"

type SortField = "name" | "cpr" | "cci" | "phase"
type SortDirection = "asc" | "desc"

interface ProductWithRating {
  id: string
  name: string
  category: string
  phase: ProductPhase
  rating: RatingSnapshot
}

export default function PortfolioPage() {
  // Generate ratings for mock products
  const productsWithRatings = useMemo(() => {
    const products = generateMockProducts()
    return products.map((p) => ({
      id: p.product.id,
      name: p.product.name,
      category: p.product.category,
      phase: p.product.phase,
      rating: computeRating(p),
    }))
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [phaseFilter, setPhaseFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("cpr")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productsWithRatings

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Phase filter
    if (phaseFilter !== "all") {
      filtered = filtered.filter((p) => p.phase.toString() === phaseFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.rating.statusLabel === statusFilter)
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (sortField) {
        case "name":
          aVal = a.name
          bVal = b.name
          break
        case "cpr":
          aVal = a.rating.cpr
          bVal = b.rating.cpr
          break
        case "cci":
          aVal = a.rating.cci
          bVal = b.rating.cci
          break
        case "phase":
          aVal = a.phase
          bVal = b.phase
          break
        default:
          return 0
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [productsWithRatings, searchQuery, phaseFilter, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

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
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Product Portfolio</h1>
            <p className="text-slate-600">
              View and analyze all products with their Evalin Product Ratings (CPR) and confidence indices.
            </p>
          </div>
          <AddProductButton />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Phase Filter */}
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Phase" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="0">Idea</SelectItem>
                <SelectItem value="1">Early Live</SelectItem>
                <SelectItem value="2">Mature Live</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Scale">Scale</SelectItem>
                <SelectItem value="Optimize">Optimize</SelectItem>
                <SelectItem value="Test">Test</SelectItem>
                <SelectItem value="Retire">Retire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div>
              <div className="text-2xl font-bold text-slate-900">{filteredAndSortedProducts.length}</div>
              <div className="text-sm text-slate-500">Total Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">
                {filteredAndSortedProducts.filter((p) => p.rating.statusLabel === "Scale").length}
              </div>
              <div className="text-sm text-slate-500">Scale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">
                {filteredAndSortedProducts.filter((p) => p.rating.statusLabel === "Optimize").length}
              </div>
              <div className="text-sm text-slate-500">Optimize</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-700">
                {
                  filteredAndSortedProducts.filter(
                    (p) => p.rating.statusLabel === "Test" || p.rating.statusLabel === "Retire",
                  ).length
                }
              </div>
              <div className="text-sm text-slate-500">Test / Retire</div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-2 font-medium text-sm text-slate-700 hover:text-slate-900"
                    >
                      Product
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <button
                      onClick={() => handleSort("phase")}
                      className="flex items-center gap-2 font-medium text-sm text-slate-700 hover:text-slate-900"
                    >
                      Phase
                      <SortIcon field="phase" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <button
                      onClick={() => handleSort("cpr")}
                      className="flex items-center gap-2 font-medium text-sm text-slate-700 hover:text-slate-900"
                    >
                      CPR
                      <SortIcon field="cpr" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <button
                      onClick={() => handleSort("cci")}
                      className="flex items-center gap-2 font-medium text-sm text-slate-700 hover:text-slate-900"
                    >
                      Confidence
                      <SortIcon field="cci" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <span className="font-medium text-sm text-slate-700">Status</span>
                  </th>
                  <th className="text-left px-6 py-3">
                    <span className="font-medium text-sm text-slate-700">Pillars</span>
                  </th>
                  <th className="text-right px-6 py-3">
                    <span className="font-medium text-sm text-slate-700">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAndSortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <div>
                          <div className="font-medium text-slate-900 hover:text-blue-600">{product.name}</div>
                          <div className="text-sm text-slate-500">{product.category}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <Badge variant="outline" className="font-normal">
                          {getPhaseLabel(product.phase)}
                        </Badge>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <div className={`text-2xl font-bold ${getCPRColor(product.rating.cpr)}`}>
                          {product.rating.cpr}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  product.rating.cci >= 0.7
                                    ? "bg-green-500"
                                    : product.rating.cci >= 0.5
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${product.rating.cci * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-slate-700 w-12">
                            {product.rating.cci.toFixed(2)}
                          </span>
                        </div>
                        {product.rating.cci < 0.6 && <div className="text-xs text-red-600 mt-1">Low confidence</div>}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <Badge className={getStatusColor(product.rating.statusLabel)}>
                          {product.rating.statusLabel}
                        </Badge>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="flex gap-1">
                          {[
                            { name: "DV", score: product.rating.demandVelocity.score },
                            { name: "RO", score: product.rating.redOceanPressure.score },
                            { name: "UE", score: product.rating.unitEconomics.score },
                            ...(product.rating.livePerformance
                              ? [{ name: "LP", score: product.rating.livePerformance.score }]
                              : []),
                          ].map((pillar) => (
                            <div
                              key={pillar.name}
                              className="flex flex-col items-center gap-1 px-2 py-1 bg-slate-50 rounded"
                              title={`${pillar.name}: ${pillar.score}`}
                            >
                              <div className="text-xs text-slate-500">{pillar.name}</div>
                              <div className={`text-xs font-semibold ${getCPRColor(pillar.score)}`}>{pillar.score}</div>
                            </div>
                          ))}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
