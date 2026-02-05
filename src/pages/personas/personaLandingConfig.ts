import type { LucideIcon } from "lucide-react";
import { Activity, DollarSign, Shield, TrendingUp } from "lucide-react";

export type PillarCardConfig = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type PersonaLandingConfig = {
  hero: {
    title: string;
    description: string;
    description2?: string;
    ctaLabel: string;
    extraBelowCtas?: string;
  };
  pillars: {
    title: string;
    subtitle?: string;
    cards: PillarCardConfig[];
    footer: string;
  };
  why: {
    title: string;
    bullets: [string, string, string];
  };
  example: {
    title: string;
    description: string;
  };
  bottomCta: {
    title: string;
    description: string;
    ctaLabel: string;
  };
};

const INTEGRATION_CARDS_DEFAULT: PillarCardConfig[] = [
  {
    icon: TrendingUp,
    title: "Demand Velocity",
    description: "External demand and intent from search trends and social signals.",
  },
  {
    icon: DollarSign,
    title: "Unit Economics",
    description: "Automated calculation of margins, landed cost including tariffs, and return risk.",
  },
  {
    icon: Shield,
    title: "Red Ocean Pressure",
    description: "Competition and advertising intensity within a specific product category.",
  },
  {
    icon: Activity,
    title: "Live Performance",
    description:
      "Real-world data from your store, including sales, conversion rates, repeat purchases, and discounting.",
  },
];

export const personaLandingConfigs: Record<"general" | "startup" | "productManager" | "founders", PersonaLandingConfig> =
  {
    general: {
      hero: {
        title: "The validation score for your product.",
        description:
          "Evalin converts demand, competition, economics, and sales data into a 300–900 rating. This single score provides the precision needed to enter, scale, fix, or retire a product.",
        ctaLabel: "Join waitlist",
      },
      pillars: {
        title: "A rating layer for your product portfolio.",
        subtitle: "Four core pillars that Evalin uses to score every product.",
        cards: INTEGRATION_CARDS_DEFAULT,
        footer:
          'Every rating includes a "Confidence Index" and a phase tag. These metrics show the strength of the data signal and how much to trust the score at each stage of the product life cycle.',
      },
      why: {
        title: "Why teams use Evalin.",
        bullets: [
          "One rating per product. Replace the clutter of spreadsheets with a single metric. Design and finance finally look at the same data.",
          "Real market visibility. Spot where demand rises, where competition is too high, and where margins remain stable.",
          "Unified decisions. Use a shared number to decide when to enter, scale, fix, or retire a product.",
        ],
      },
      example: {
        title: "Example: Mature product inside Evalin",
        description:
          "A mature SKU scored by Evalin: one 300–900 rating, pillar breakdowns, and a confidence index that together explain why this product is tagged to scale rather than fix or retire.",
      },
      bottomCta: {
        title: "Ready to stop guessing?",
        description:
          "See which products deserve the next dollar of investment with a single rating for every product.",
        ctaLabel: "Request access",
      },
    },
    startup: {
      hero: {
        title: "Build products with evidence, not just runway.",
        description:
          "Evalin provides a 300–900 rating and confidence index for every product idea. Identify what is worth building before investing time and capital.",
        ctaLabel: "Join early-stage beta",
        extraBelowCtas: "For early-stage startups that cannot afford to ship the wrong product twice.",
      },
      pillars: {
        title: "A rating layer for your product portfolio.",
        subtitle: "Four core pillars that Evalin uses to score every product.",
        cards: [
          INTEGRATION_CARDS_DEFAULT[0],
          INTEGRATION_CARDS_DEFAULT[1],
          INTEGRATION_CARDS_DEFAULT[2],
          {
            ...INTEGRATION_CARDS_DEFAULT[3],
            description: "Direct store data including sales, conversion, and repeat purchase behavior.",
          },
        ],
        footer:
          "Every rating includes a Confidence Index and a phase tag. These metrics show the strength of the data signal and how much to trust the score at each stage of the product life cycle.",
      },
      why: {
        title: "Why early-stage teams use Evalin.",
        bullets: [
          "Filter ideas before committing design, engineering, or inventory resources.",
          "Anchor discussions on objective numbers instead of internal opinions.",
          "Present investors with a clear, defensible logic for the product roadmap.",
        ],
      },
      example: {
        title: "Example: Mature product inside Evalin",
        description:
          "A successful product shows a clear rating, pillar scores, and a high confidence level. These metrics indicate why a product is a strong candidate for further investment.",
      },
      bottomCta: {
        title: "Give the next release a real green light.",
        description: "Run ideas through Evalin to see which products deserve runway.",
        ctaLabel: "Join early-stage beta",
      },
    },
    productManager: {
      hero: {
        title: "A standardized scoring system for product roadmap prioritization.",
        description:
          "Evalin combines demand, competitive, economic, and behavioral data into a 300–900 rating and confidence index for each product or initiative, giving PMs a shared signal for what to build, grow, or sunset.",
        ctaLabel: "Request Access",
        extraBelowCtas: "For teams that need a consistent way to compare different products in their catalog.",
      },
      pillars: {
        title: "A rating layer for your product portfolio.",
        subtitle: "Four core pillars that Evalin uses to score every product.",
        cards: [
          INTEGRATION_CARDS_DEFAULT[0],
          {
            icon: Shield,
            title: "Red Ocean Pressure",
            description: "Competition and advertising intensity in your category.",
          },
          {
            ...INTEGRATION_CARDS_DEFAULT[1],
            description: "Automated calculation of margins, landed cost, and return risk.",
          },
          {
            ...INTEGRATION_CARDS_DEFAULT[3],
            description: "Sales, conversion, repeat purchase, and discount behavior across your products.",
          },
        ],
        footer:
          "Every Evalin product rating is backed by a Confidence Index (0.00–1.00) and a phase tag (idea, early live, mature), so teams see not just the score, but how strong the signal is and how much to trust it.",
      },
      why: {
        title: "Why product teams use Evalin",
        bullets: [
          "Use one shared number to explain product health and potential to stakeholders.",
          "Compare new ideas against live products using the same data-driven framework.",
          "Back up decisions to launch or cancel a product with objective, versioned logic.",
        ],
      },
      example: {
        title: "Example: Mature product inside Evalin",
        description:
          "A mature SKU scored by Evalin: one 300–900 rating, pillar breakdowns, and a confidence index that together explain why this product is tagged to scale rather than fix or retire.",
      },
      bottomCta: {
        title: "Give me the next release a real green light",
        description: "Run products through Evalin to see which products deserve runway.",
        ctaLabel: "Request Access",
      },
    },
    founders: {
      hero: {
        title: "Validate your product idea before the first order.",
        description:
          "Evalin pulls in demand, competition, and cost signals to generate a 300–900 rating and a confidence index. First-time founders can stop guessing with their initial inventory purchases.",
        description2: "For new founders picking a first product or category.",
        ctaLabel: "Check my product idea",
      },
      pillars: {
        title: "One simple score, four data pillars.",
        subtitle: "Evalin analyzes these pillars before providing a recommendation.",
        cards: [
          {
            icon: TrendingUp,
            title: "Demand Velocity",
            description: "Search trends and social interest showing if current demand is real.",
          },
          {
            icon: DollarSign,
            title: "Unit Economics",
            description: "Profit remaining after product costs, shipping, tariffs, and potential returns.",
          },
          {
            icon: Shield,
            title: "Red Ocean Pressure",
            description: "Market crowding and the intensity of competition.",
          },
          {
            icon: Activity,
            title: "Live Performance",
            description:
              "Post-launch behavior including sales, conversion rates, repeat purchases, and discounting.",
          },
        ],
        footer:
          "Every rating includes a Confidence Index and phase tag. This identifies the difference between a strong signal and an early hint.",
      },
      why: {
        title: "Why new founders start with Evalin.",
        bullets: [
          "Protect capital by avoiding products that lack a verified market signal.",
          "Real market visibility. Spot where demand rises, where competition is too high, and where margins remain stable.",
          "Compare multiple ideas side by side with one score instead of many tabs.",
        ],
      },
      example: {
        title: "Example: Mature product inside Evalin",
        description:
          "A mature SKU scored by Evalin: one 300–900 rating, pillar breakdowns, and a confidence index that together explain why this product is tagged to scale rather than fix or retire.",
      },
      bottomCta: {
        title: "Stop guessing with the first inventory order.",
        description:
          "Validate product ideas through Evalin to see which items are worth bringing to life.",
        ctaLabel: "Get my first product scored",
      },
    },
  };

