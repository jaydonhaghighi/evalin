import { NextResponse } from "next/server"
import { generateMockProducts } from "@/lib/mock-data"
import { computeRating } from "@/lib/scoring-engine"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phase = searchParams.get("phase")
    const status = searchParams.get("status")
    const limit = searchParams.get("limit")

    // Get all products with ratings
    const products = generateMockProducts()
    let results = products.map((p) => {
      const rating = computeRating(p)
      return {
        id: p.product.id,
        name: p.product.name,
        description: p.product.description,
        category: p.product.category,
        tags: p.product.tags,
        phase: p.product.phase,
        createdAt: p.product.createdAt,
        updatedAt: p.product.updatedAt,
        rating: {
          cpr: rating.cpr,
          cci: rating.cci,
          statusLabel: rating.statusLabel,
          algoVersion: rating.algoVersion,
          timestamp: rating.timestamp,
          pillars: {
            demandVelocity: rating.demandVelocity.score,
            redOceanPressure: rating.redOceanPressure.score,
            unitEconomics: rating.unitEconomics.score,
            livePerformance: rating.livePerformance?.score,
          },
        },
      }
    })

    // Apply filters
    if (phase) {
      results = results.filter((p) => p.phase.toString() === phase)
    }

    if (status) {
      results = results.filter((p) => p.rating.statusLabel === status)
    }

    // Apply limit
    if (limit) {
      const limitNum = Number.parseInt(limit, 10)
      if (!Number.isNaN(limitNum) && limitNum > 0) {
        results = results.slice(0, limitNum)
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.category || body.phase === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, category, phase",
        },
        { status: 400 },
      )
    }

    // In a real app, this would save to a database and return the created product
    // For now, return a mock response
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: body.name,
      description: body.description || "",
      category: body.category,
      tags: body.tags || [],
      phase: body.phase,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "Product created successfully (demo mode)",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
      },
      { status: 500 },
    )
  }
}
