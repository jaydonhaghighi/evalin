import type { Product, Phase, RatingSnapshot } from '@/types/product';
import { calculateProductScore } from './scoring-engine';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const PRODUCT_NAMES = [
  'Premium Wireless Earbuds',
  'Organic Green Tea Set',
  'Ergonomic Office Chair',
  'Smart Home Hub Pro',
  'Artisan Coffee Maker',
  'Yoga Mat Ultra',
  'LED Desk Lamp',
  'Portable Power Bank',
  'Bamboo Cutting Board',
  'Memory Foam Pillow',
  'Stainless Steel Water Bottle',
  'Bluetooth Speaker Mini',
  'Leather Wallet Classic',
  'Ceramic Plant Pots',
  'Digital Kitchen Scale',
];

const CATEGORIES = [
  'Electronics',
  'Home & Kitchen',
  'Health & Wellness',
  'Office Supplies',
  'Sports & Outdoors',
];

const TAGS_POOL = [
  'premium', 'eco-friendly', 'bestseller', 'trending', 'new',
  'budget', 'luxury', 'sustainable', 'innovative', 'classic',
];

function generateProduct(index: number): Product {
  const phase = pickRandom([0, 0, 1, 1, 2, 2, 2]) as Phase;
  const isLive = phase > 0;

  const product: Product = {
    id: `prod_${index.toString().padStart(3, '0')}`,
    name: PRODUCT_NAMES[index % PRODUCT_NAMES.length],
    description: `A high-quality product designed for modern consumers.`,
    category: pickRandom(CATEGORIES),
    tags: Array.from({ length: randomInt(1, 3) }, () => pickRandom(TAGS_POOL)),
    phase,
    externalSignals: {
      searchVolume: randomInt(1000, 50000),
      searchTrendSlope: randomBetween(-0.5, 0.8),
      keywordIntentRatio: randomBetween(0.2, 0.9),
      socialEngagementVelocity: randomInt(100, 5000),
      competitorReviewDepth: randomInt(50, 2000),
      cpcEstimate: randomBetween(0.5, 5.0),
      sellerSaturation: randomInt(10, 150),
    },
    economics: {
      grossMarginPercent: randomBetween(15, 70),
      cogs: randomBetween(5, 50),
      landedCost: randomBetween(8, 60),
      returnRate: randomBetween(2, 25),
    },
    performance: isLive ? {
      recentUnitsSold: randomInt(10, 500),
      sessions: randomInt(100, 10000),
      conversionRate: randomBetween(1, 8),
      repeatPurchaseRate: randomBetween(5, 40),
      discountDependency: randomBetween(10, 60),
    } : {},
    ratingHistory: [],
    createdAt: new Date(Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Calculate initial rating
  const rating = calculateProductScore(product);
  product.latestRating = rating;
  product.ratingHistory = [rating];

  // Generate some historical ratings for mature products
  if (phase === 2) {
    const historyCount = randomInt(3, 7);
    for (let i = 1; i <= historyCount; i++) {
      const historicalRating: RatingSnapshot = {
        ...rating,
        id: crypto.randomUUID(),
        nsr: rating.nsr + randomInt(-50, 50),
        confidenceIndex: Math.max(0.3, Math.min(1, rating.confidenceIndex + randomBetween(-0.1, 0.1))),
        timestamp: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      product.ratingHistory.unshift(historicalRating);
    }
  }

  return product;
}

export function generateMockProducts(count: number = 15): Product[] {
  return Array.from({ length: count }, (_, i) => generateProduct(i));
}

// Singleton store for mock data
let mockProducts: Product[] | null = null;

export function getMockProducts(): Product[] {
  if (!mockProducts) {
    mockProducts = generateMockProducts(15);
  }
  return mockProducts;
}

export function getMockProductById(id: string): Product | undefined {
  return getMockProducts().find(p => p.id === id);
}

export function updateMockProduct(id: string, updates: Partial<Product>): Product | undefined {
  const products = getMockProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return undefined;

  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  
  // Recalculate score
  const newRating = calculateProductScore(products[index]);
  products[index].latestRating = newRating;
  products[index].ratingHistory.push(newRating);

  return products[index];
}