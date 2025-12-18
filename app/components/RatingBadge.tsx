import { Badge } from '@/components/ui/badge';
import { getRatingLabel, type RatingLabel } from '@/types/product';
import { Rocket, Shield, FlaskConical, Archive } from 'lucide-react';

interface RatingBadgeProps {
  score: number;
  showIcon?: boolean;
}

const LABEL_CONFIG: Record<RatingLabel, {
  variant: 'scale' | 'defend' | 'test' | 'retire';
  icon: typeof Rocket;
}> = {
  Scale: { variant: 'scale', icon: Rocket },
  Defend: { variant: 'defend', icon: Shield },
  Test: { variant: 'test', icon: FlaskConical },
  Retire: { variant: 'retire', icon: Archive },
};

export function RatingBadge({ score, showIcon = true }: RatingBadgeProps) {
  const label = getRatingLabel(score);
  const config = LABEL_CONFIG[label];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      {showIcon && <Icon className="w-3 h-3" />}
      {label}
    </Badge>
  );
}
