'use client';

/**
 * Falcon Rider Admin Portal — Bar Chart
 */

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';

export interface BarChartDataPoint {
  [key: string]: string | number;
}

interface BarChartProps {
  title: string;
  description?: string;
  data: BarChartDataPoint[];
  xKey: string;
  bars: { key: string; label: string; color?: string }[];
  isLoading?: boolean;
  height?: number;
  formatter?: (value: number) => string;
  layout?: 'horizontal' | 'vertical';
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function BarChart({
  title,
  description,
  data,
  xKey,
  bars,
  isLoading,
  height = 300,
  formatter,
  layout = 'horizontal',
}: BarChartProps) {
  const isVertical = layout === 'vertical';

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
            <RechartsBarChart
              data={data}
              layout={layout}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              {isVertical ? (
                <>
                  <XAxis
                    type="number"
                    className="text-xs"
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    stroke="currentColor"
                    tickFormatter={formatter}
                  />
                  <YAxis
                    type="category"
                    dataKey={xKey}
                    className="text-xs"
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    stroke="currentColor"
                    width={100}
                  />
                </>
              ) : (
                <>
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
                </>
              )}
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
              {bars.map((bar, i) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.label}
                  fill={bar.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}