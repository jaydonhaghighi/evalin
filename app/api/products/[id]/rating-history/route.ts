import { NextResponse } from "next/server"
import { generateMockProducts } from "@/lib/mock-data"
import { computeRating } from "@/lib/scoring-engine"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    // Find product
    const products = generateMockProducts()
    const productData = products.find((p) => p.product.id === id)

    if (!productData) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    // In a real app, this would return historical ratings from database
    // For demo, generate a few historical ratings with slight variations
    const currentRating = computeRating(productData)
    const history = [
      {
        ...currentRating,
        timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        cpr: Math.max(300, currentRating.cpr - 30),
      },
      {
        ...currentRating,
        timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        cpr: Math.max(300, currentRating.cpr - 20),
      },
      {
        ...currentRating,
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        cpr: Math.max(300, currentRating.cpr - 10),
      },
      {
        ...currentRating,
        timestamp: new Date(), // Current
      },
    ]

    return NextResponse.json({
      success: true,
      count: history.length,
      data: history.map((h) => ({
        cpr: h.cpr,
        cci: h.cci,
        statusLabel: h.statusLabel,
        algoVersion: h.algoVersion,
        timestamp: h.timestamp,
        pillars: {
          demandVelocity: h.demandVelocity.score,
          redOceanPressure: h.redOceanPressure.score,
          unitEconomics: h.unitEconomics.score,
          livePerformance: h.livePerformance?.score,
        },
      })),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch rating history",
      },
      { status: 500 },
    )
  }
}
