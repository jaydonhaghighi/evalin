import { cn } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

export function ScoreGauge({ score, size = 'md', showLabel = true, animate = true }: ScoreGaugeProps) {
  // Normalize score from 300-900 to 0-100%
  const percentage = ((score - 300) / 600) * 100;
  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const labelSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  // Calculate color based on score
  const getScoreColor = () => {
    if (score >= 750) return 'text-rating-scale';
    if (score >= 600) return 'text-rating-defend';
    if (score >= 450) return 'text-rating-test';
    return 'text-rating-retire';
  };

  const getStrokeColor = () => {
    if (score >= 750) return 'stroke-rating-scale';
    if (score >= 600) return 'stroke-rating-defend';
    if (score >= 450) return 'stroke-rating-test';
    return 'stroke-rating-retire';
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative', sizeClasses[size])}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn(getStrokeColor(), animate && 'transition-all duration-1000 ease-out')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animate ? strokeDashoffset : circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold font-mono', textSizes[size], getScoreColor())}>
          {score}
        </span>
        {showLabel && (
          <span className={cn('text-muted-foreground uppercase tracking-wider', labelSizes[size])}>
            NSR
          </span>
        )}
      </div>
    </div>
  );
}
