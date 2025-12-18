import { Badge } from '@/components/ui/badge';
import { PHASE_LABELS, type Phase } from '@/types/product';
import { Lightbulb, Sprout, TreeDeciduous } from 'lucide-react';

interface PhaseBadgeProps {
  phase: Phase;
}

const PHASE_CONFIG: Record<Phase, {
  variant: 'idea' | 'early' | 'mature';
  icon: typeof Lightbulb;
}> = {
  0: { variant: 'idea', icon: Lightbulb },
  1: { variant: 'early', icon: Sprout },
  2: { variant: 'mature', icon: TreeDeciduous },
};

export function PhaseBadge({ phase }: PhaseBadgeProps) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;
  const label = PHASE_LABELS[phase];

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}
