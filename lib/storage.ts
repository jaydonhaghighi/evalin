import type { Product, ExternalSignals, Economics, PerformanceSnapshot, RatingSnapshot } from "./types"

// Simple in-memory storage for demo purposes
// In production, this would use a database

interface StoredProduct {
  product: Product
  externalSignals?: ExternalSignals
  economics?: Economics
  performance?: PerformanceSnapshot
  ratings: RatingSnapshot[]
}

class ProductStore {
  private products: Map<string, StoredProduct> = new Map()

  addProduct(data: Omit<StoredProduct, "ratings">) {
    this.products.set(data.product.id, {
      ...data,
      ratings: [],
    })
  }

  getProduct(id: string): StoredProduct | undefined {
    return this.products.get(id)
  }

  getAllProducts(): StoredProduct[] {
    return Array.from(this.products.values())
  }

  updateProduct(id: string, data: Partial<Omit<StoredProduct, "ratings">>) {
    const existing = this.products.get(id)
    if (existing) {
      this.products.set(id, {
        ...existing,
        ...data,
        product: { ...existing.product, ...data.product, updatedAt: new Date() },
      })
    }
  }

  addRating(productId: string, rating: RatingSnapshot) {
    const product = this.products.get(productId)
    if (product) {
      product.ratings.push(rating)
    }
  }

  getLatestRating(productId: string): RatingSnapshot | undefined {
    const product = this.products.get(productId)
    if (!product || product.ratings.length === 0) return undefined
    return product.ratings[product.ratings.length - 1]
  }

  getRatingHistory(productId: string): RatingSnapshot[] {
    const product = this.products.get(productId)
    return product?.ratings || []
  }

  deleteProduct(id: string) {
    this.products.delete(id)
  }
}

// Export singleton instance
export const productStore = new ProductStore()
