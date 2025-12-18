import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConfidenceIndicatorProps {
  value: number; // 0.00 - 1.00
  showWarning?: boolean;
  size?: 'sm' | 'md';
}

export function ConfidenceIndicator({ value, showWarning = true, size = 'md' }: ConfidenceIndicatorProps) {
  const percentage = Math.round(value * 100);
  const isLow = value < 0.5;
  const isMedium = value >= 0.5 && value < 0.75;

  const getColor = () => {
    if (value >= 0.75) return 'bg-confidence-high';
    if (value >= 0.5) return 'bg-confidence-medium';
    return 'bg-confidence-low';
  };

  const getTextColor = () => {
    if (value >= 0.75) return 'text-confidence-high';
    if (value >= 0.5) return 'text-confidence-medium';
    return 'text-confidence-low';
  };

  const sizeClasses = {
    sm: 'h-1.5 w-16',
    md: 'h-2 w-20',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <div className={cn('bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={cn('h-full rounded-full transition-all duration-500', getColor())}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={cn('font-mono font-medium', textClasses[size], getTextColor())}>
          {percentage}%
        </span>
      </div>
      {showWarning && isLow && (
        <Tooltip>
          <TooltipTrigger>
            <AlertCircle className="w-4 h-4 text-confidence-low" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Low confidence: limited data available</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
