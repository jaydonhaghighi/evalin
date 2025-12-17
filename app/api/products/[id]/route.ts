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

    const rating = computeRating(productData)

    const result = {
      id: productData.product.id,
      name: productData.product.name,
      description: productData.product.description,
      category: productData.product.category,
      tags: productData.product.tags,
      phase: productData.product.phase,
      createdAt: productData.product.createdAt,
      updatedAt: productData.product.updatedAt,
      rating: {
        cpr: rating.cpr,
        cci: rating.cci,
        statusLabel: rating.statusLabel,
        algoVersion: rating.algoVersion,
        timestamp: rating.timestamp,
        pillars: {
          demandVelocity: {
            score: rating.demandVelocity.score,
            zScore: rating.demandVelocity.zScore,
            metrics: rating.demandVelocity.metrics,
          },
          redOceanPressure: {
            score: rating.redOceanPressure.score,
            zScore: rating.redOceanPressure.zScore,
            metrics: rating.redOceanPressure.metrics,
          },
          unitEconomics: {
            score: rating.unitEconomics.score,
            zScore: rating.unitEconomics.zScore,
            metrics: rating.unitEconomics.metrics,
          },
          ...(rating.livePerformance && {
            livePerformance: {
              score: rating.livePerformance.score,
              zScore: rating.livePerformance.zScore,
              metrics: rating.livePerformance.metrics,
            },
          }),
        },
      },
      externalSignals: productData.externalSignals,
      economics: productData.economics,
      performance: productData.performance,
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // In a real app, this would update the database
    return NextResponse.json({
      success: true,
      message: "Product updated successfully (demo mode)",
      data: { id, ...body },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    // In a real app, this would delete from database
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully (demo mode)",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete product",
      },
      { status: 500 },
    )
  }
}
