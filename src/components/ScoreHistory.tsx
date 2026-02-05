import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { type RatingSnapshot } from '@/types/product';
import { format } from 'date-fns';

interface ScoreHistoryProps {
  history: RatingSnapshot[];
}

function nsrToneFromScore(score: number): "low" | "mid" | "high" {
  // red (worse) → green (avg) → blue (best)
  if (score >= 750) return "high";
  if (score >= 600) return "mid";
  return "low";
}

function nsrColorVar(score: number) {
  const tone = nsrToneFromScore(score);
  if (tone === "high") return "var(--rating-defend)"; // blue
  if (tone === "mid") return "var(--rating-scale)"; // green
  return "var(--rating-retire)"; // red
}

export function ScoreHistory({ history }: ScoreHistoryProps) {
  const data = useMemo(() => {
    return history.map(r => ({
      date: format(new Date(r.timestamp), 'MMM d'),
      nsr: r.nsr,
      ci: Math.round(r.confidenceIndex * 100),
    }));
  }, [history]);

  if (history.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Not enough data for historical chart
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="nsrGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--gauge-low))" />
              <stop offset="50%" stopColor="hsl(var(--gauge-mid))" />
              <stop offset="100%" stopColor="hsl(var(--gauge-high))" />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            domain={[300, 900]} 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <ReferenceLine y={750} stroke="hsl(var(--rating-defend))" strokeDasharray="3 3" />
          <ReferenceLine y={600} stroke="hsl(var(--rating-scale))" strokeDasharray="3 3" />
          <ReferenceLine y={450} stroke="hsl(var(--rating-retire))" strokeDasharray="3 3" strokeOpacity={0.7} />
          <Line 
            type="monotone" 
            dataKey="nsr" 
            stroke="url(#nsrGradient)"
            strokeWidth={2.5}
            dot={(props) => {
              const value = typeof props.value === "number" ? props.value : undefined;
              if (value === undefined || props.cx == null || props.cy == null) return <g />;
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={3.5}
                  fill="#111111"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={(props) => {
              const value = typeof props.value === "number" ? props.value : undefined;
              if (value === undefined || props.cx == null || props.cy == null) return <g />;
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={6}
                  fill="#111111"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
