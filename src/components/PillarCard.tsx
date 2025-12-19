import { cn } from '@/lib/utils';
import { TrendingUp, Shield, DollarSign, Activity } from 'lucide-react';

type PillarType = 'dv' | 'ro' | 'ue' | 'lp';

interface PillarCardProps {
  pillar: PillarType;
  score: number | null;
  compact?: boolean;
}

const PILLAR_CONFIG: Record<PillarType, {
  name: string;
  fullName: string;
  icon: typeof TrendingUp;
  colorClass: string;
  bgClass: string;
  description: string;
}> = {
  dv: {
    name: 'DV',
    fullName: 'Demand Velocity',
    icon: TrendingUp,
    colorClass: 'text-pillar-dv',
    bgClass: 'bg-pillar-dv/10',
    description: 'Market demand and growth potential',
  },
  ro: {
    name: 'RO',
    fullName: 'Red Ocean Pressure',
    icon: Shield,
    colorClass: 'text-pillar-ro',
    bgClass: 'bg-pillar-ro/10',
    description: 'Competition intensity and barriers',
  },
  ue: {
    name: 'UE',
    fullName: 'Unit Economics',
    icon: DollarSign,
    colorClass: 'text-pillar-ue',
    bgClass: 'bg-pillar-ue/10',
    description: 'Profitability and cost structure',
  },
  lp: {
    name: 'LP',
    fullName: 'Live Performance',
    icon: Activity,
    colorClass: 'text-pillar-lp',
    bgClass: 'bg-pillar-lp/10',
    description: 'Real-world sales and engagement',
  },
};

export function PillarCard({ pillar, score, compact = false }: PillarCardProps) {
  const config = PILLAR_CONFIG[pillar];
  const Icon = config.icon;
  const percentage = score !== null ? ((score - 300) / 600) * 100 : 0;
  const isDisabled = score === null;

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-2 px-2 py-1 rounded-md',
        isDisabled ? 'opacity-40' : config.bgClass
      )}>
        <Icon className={cn('w-3.5 h-3.5', config.colorClass)} />
        <span className="text-xs font-medium text-muted-foreground">{config.name}</span>
        <span className={cn('text-xs font-mono font-semibold', config.colorClass)}>
          {score ?? '—'}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-lg border p-4 transition-all',
      isDisabled ? 'opacity-50 bg-muted/30' : 'bg-card hover:shadow-md'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('p-2 rounded-lg', config.bgClass)}>
            <Icon className={cn('w-4 h-4', config.colorClass)} />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{config.fullName}</h4>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <span className={cn('text-2xl font-bold font-mono', isDisabled ? 'text-muted-foreground' : config.colorClass)}>
          {score ?? '—'}
        </span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>300</span>
          <span>600</span>
          <span>900</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', isDisabled ? 'bg-muted-foreground/30' : config.colorClass.replace('text-', 'bg-'))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
