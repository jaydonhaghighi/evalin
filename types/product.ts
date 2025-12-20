// Compatibility shim:
// The canonical product types live in `src/types/product.ts` and are imported via `@/types/product`.
// This file re-exports them for any legacy imports that still reference `types/product`.

export type {
  Phase,
  RatingLabel,
  RatingSnapshot,
  Product,
  CreateProductInput,
  ExternalSignals,
  Economics,
  PerformanceSnapshot,
} from "../src/types/product";

export { PHASE_LABELS, getRatingLabel } from "../src/types/product";

