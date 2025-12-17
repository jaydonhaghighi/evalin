import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    name: "Cohorent API",
    version: "1.0.0",
    description: "Product intelligence and scoring platform API",
    endpoints: {
      products: {
        list: {
          method: "GET",
          path: "/api/products",
          description: "List all products with ratings",
          queryParams: {
            phase: "Filter by phase (0, 1, or 2)",
            status: "Filter by status label (Scale, Optimize, Test, Retire)",
            limit: "Limit number of results",
          },
        },
        get: {
          method: "GET",
          path: "/api/products/:id",
          description: "Get detailed product information and rating",
        },
        create: {
          method: "POST",
          path: "/api/products",
          description: "Create a new product",
          body: {
            name: "string (required)",
            description: "string",
            category: "string (required)",
            tags: "string[]",
            phase: "number (0, 1, or 2) (required)",
            externalSignals: "object (optional)",
            economics: "object (optional)",
            performance: "object (optional for phase 0)",
          },
        },
        update: {
          method: "PUT",
          path: "/api/products/:id",
          description: "Update an existing product",
        },
        delete: {
          method: "DELETE",
          path: "/api/products/:id",
          description: "Delete a product",
        },
        ratingHistory: {
          method: "GET",
          path: "/api/products/:id/rating-history",
          description: "Get historical ratings for a product",
        },
      },
    },
    ratingSystem: {
      scale: "300-900",
      pillars: ["Demand Velocity", "Red Ocean Pressure", "Unit Economics", "Live Performance (for live products)"],
      confidenceIndex: "0.00-1.00",
      statusLabels: ["Scale", "Optimize", "Test", "Retire"],
    },
    documentation: "https://docs.cohorent.dev",
  })
}
