import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { type RatingSnapshot } from '@/types/product';
import { format } from 'date-fns';

interface ScoreHistoryProps {
  history: RatingSnapshot[];
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
          <ReferenceLine y={750} stroke="hsl(var(--rating-scale))" strokeDasharray="3 3" />
          <ReferenceLine y={600} stroke="hsl(var(--rating-defend))" strokeDasharray="3 3" />
          <ReferenceLine y={450} stroke="hsl(var(--rating-test))" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="nsr" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
