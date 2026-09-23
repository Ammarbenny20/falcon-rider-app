'use client';

/**
 * Falcon Rider Admin Portal — Line Chart
 */

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';

export interface LineChartDataPoint {
  [key: string]: string | number;
}

interface LineChartProps {
  title: string;
  description?: string;
  data: LineChartDataPoint[];
  xKey: string;
  lines: { key: string; label: string; color?: string }[];
  isLoading?: boolean;
  height?: number;
  formatter?: (value: number) => string;
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function LineChart({
  title,
  description,
  data,
  xKey,
  lines,
  isLoading,
  height = 300,
  formatter,
}: LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full" style={{ height }} />
        ) : data.length === 0 ? (
          <div
            className="flex items-center justify-center text-sm text-muted-foreground"
            style={{ height }}
          >
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey={xKey}
                className="text-xs"
                tick={{ fill: 'currentColor', fontSize: 11 }}
                stroke="currentColor"
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'currentColor', fontSize: 11 }}
                stroke="currentColor"
                tickFormatter={formatter}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
                formatter={formatter ? (value) => formatter(Number(value)) : undefined}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {lines.map((line, i) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.label}
                  stroke={line.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}