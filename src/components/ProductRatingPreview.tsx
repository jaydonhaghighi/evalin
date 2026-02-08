import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity, DollarSign, Shield, TrendingUp } from "lucide-react";

type PillarKey = "Demand Velocity" | "Red Ocean Pressure" | "Unit Economics" | "Live Performance";

export type ProductRatingPreviewProps = {
  productName: string;
  ratingLabel: "Scale" | "Defend" | "Test" | "Retire";
  phaseLabel: string;
  coherentRating: number;
  confidence: number; // 0-1
  pillars: Array<{
    title: PillarKey;
    score: number;
    note: string;
  }>;
  interpretation: string;
  className?: string;
};

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function progressFromScore(score: number) {
  // 300-900 normalized
  return clamp01((score - 300) / 600);
}

function badgeVariantForLabel(label: ProductRatingPreviewProps["ratingLabel"]) {
  if (label === "Scale") return "scale";
  if (label === "Defend") return "defend";
  if (label === "Test") return "test";
  return "retire";
}

function ratingTextClass(label: ProductRatingPreviewProps["ratingLabel"]) {
  if (label === "Scale") return "text-rating-scale";
  if (label === "Defend") return "text-rating-defend";
  if (label === "Test") return "text-rating-test";
  return "text-rating-retire";
}

function ratingBarClass(label: ProductRatingPreviewProps["ratingLabel"]) {
  if (label === "Scale") return "bg-rating-scale";
  if (label === "Defend") return "bg-rating-defend";
  if (label === "Test") return "bg-rating-test";
  return "bg-rating-retire";
}

function ratingStrokeClass(label: ProductRatingPreviewProps["ratingLabel"]) {
  if (label === "Scale") return "stroke-rating-scale";
  if (label === "Defend") return "stroke-rating-defend";
  if (label === "Test") return "stroke-rating-test";
  return "stroke-rating-retire";
}

function nsrToneFromScore(score: number): "low" | "mid" | "high" {
  // 300–900 scale: red (worse) → green (avg) → blue (best)
  if (score >= 750) return "high";
  if (score >= 600) return "mid";
  return "low";
}

function nsrTextClass(score: number) {
  const tone = nsrToneFromScore(score);
  if (tone === "high") return "text-rating-defend";
  if (tone === "mid") return "text-rating-scale";
  return "text-rating-retire";
}

function nsrStrokeClass(score: number) {
  const tone = nsrToneFromScore(score);
  if (tone === "high") return "stroke-rating-defend";
  if (tone === "mid") return "stroke-rating-scale";
  return "stroke-rating-retire";
}

function pillarTheme(title: PillarKey): { barClass: string; textClass: string; dotClass: string } {
  switch (title) {
    case "Demand Velocity":
      return { barClass: "bg-pillar-dv", textClass: "text-pillar-dv", dotClass: "bg-pillar-dv" };
    case "Red Ocean Pressure":
      return { barClass: "bg-pillar-ro", textClass: "text-pillar-ro", dotClass: "bg-pillar-ro" };
    case "Unit Economics":
      return { barClass: "bg-pillar-ue", textClass: "text-pillar-ue", dotClass: "bg-pillar-ue" };
    case "Live Performance":
      return { barClass: "bg-pillar-lp", textClass: "text-pillar-lp", dotClass: "bg-pillar-lp" };
  }
}

function pillarIcon(title: PillarKey) {
  switch (title) {
    case "Demand Velocity":
      return TrendingUp;
    case "Red Ocean Pressure":
      return Shield;
    case "Unit Economics":
      return DollarSign;
    case "Live Performance":
      return Activity;
  }
}

export function ProductRatingPreview({
  productName,
  ratingLabel,
  phaseLabel,
  coherentRating,
  confidence,
  pillars,
  interpretation,
  className,
}: ProductRatingPreviewProps) {
  const confidence01 = clamp01(confidence);
  const confidencePct = Math.round(confidence01 * 100);
  const sorted = [...pillars].slice(0, 4);
  const scorePct = Math.round(progressFromScore(coherentRating) * 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePct / 100) * circumference;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight truncate">{productName}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <Badge variant={badgeVariantForLabel(ratingLabel)} className="capitalize">
                {ratingLabel}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground font-medium">
                {phaseLabel}
              </Badge>
            </div>
          </div>

          <div className="w-full md:w-auto text-left md:text-right">
            <div className="w-full max-w-full rounded-2xl border bg-muted/20 p-3 md:p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
                <div className="relative w-[92px] h-[92px] md:w-[104px] md:h-[104px] shrink-0">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                    role="img"
                    aria-label={`Coherent rating ${coherentRating} (NSR), ${scorePct}% of the 300–900 range`}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-muted opacity-30"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className={cn(nsrStrokeClass(coherentRating), "transition-all duration-700 ease-out")}
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset,
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={cn(
                        "text-[26px] md:text-[30px] leading-none font-semibold font-mono tabular-nums",
                        nsrTextClass(coherentRating),
                      )}
                    >
                      {coherentRating}
                    </span>
                    <span className="mt-1 text-[10px] leading-none uppercase tracking-wider text-muted-foreground">NSR</span>
                  </div>
                </div>

                <div className="min-w-0 w-full flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Confidence Index</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono tabular-nums text-[13px] text-foreground">{confidencePct}%</p>
                    </div>
                  </div>

                  <div className="mt-2.5 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        ratingBarClass(ratingLabel),
                      )}
                      style={{ width: `${confidencePct}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((p) => {
            const pct = Math.round(progressFromScore(p.score) * 100);
            const theme = pillarTheme(p.title);
            const Icon = pillarIcon(p.title);
            return (
              <div key={p.title} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={cn("h-4 w-4 shrink-0", theme.textClass)} aria-hidden="true" />
                    <p className="text-sm font-medium truncate">{p.title}</p>
                  </div>
                  <p className={cn("text-sm font-semibold font-mono tabular-nums", theme.textClass)}>{p.score}</p>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full", theme.barClass)} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{p.note}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Interpretation:</span>{" "}
            {interpretation.replace(/^Interpretation:\s*/i, "")}
          </p>
        </div>
      </div>
    </div>
  );
}

