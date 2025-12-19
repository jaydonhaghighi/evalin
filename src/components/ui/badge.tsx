import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Rating tier badges
        scale: "border border-rating-scale/20 bg-rating-scale-bg text-rating-scale font-semibold",
        defend: "border border-rating-defend/20 bg-rating-defend-bg text-rating-defend font-semibold",
        test: "border border-rating-test/20 bg-rating-test-bg text-rating-test font-semibold",
        retire: "border border-rating-retire/20 bg-rating-retire-bg text-rating-retire font-semibold",
        // Phase badges
        idea: "border border-pillar-dv/20 bg-pillar-dv/10 text-pillar-dv",
        early: "border border-pillar-lp/20 bg-pillar-lp/10 text-pillar-lp",
        mature: "border border-pillar-ue/20 bg-pillar-ue/10 text-pillar-ue",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
