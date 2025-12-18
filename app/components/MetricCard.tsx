import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  description?: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, unit, trend, description, highlight }: MetricCardProps) {
  const displayValue = value === null || value === undefined ? '—' : value;
  const hasValue = value !== null && value !== undefined;

  const TrendIcon = trend === 'positive' ? ArrowUp : trend === 'negative' ? ArrowDown : Minus;
  const trendColor = trend === 'positive' ? 'text-rating-scale' : trend === 'negative' ? 'text-rating-retire' : 'text-muted-foreground';

  return (
    <div className={cn(
      'rounded-lg border p-4 transition-all',
      highlight ? 'bg-primary/5 border-primary/20' : 'bg-card'
    )}>
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {trend && hasValue && (
          <TrendIcon className={cn('h-4 w-4', trendColor)} />
        )}
      </div>
      <p className={cn(
        'text-2xl font-bold font-mono mt-1',
        !hasValue && 'text-muted-foreground'
      )}>
        {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
        {unit && hasValue && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
