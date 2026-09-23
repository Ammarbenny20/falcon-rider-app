'use client';

/**
 * Falcon Rider Admin Portal — Pie Chart
 */

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';

export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title: string;
  description?: string;
  data: PieChartDataPoint[];
  isLoading?: boolean;
  height?: number;
  formatter?: (value: number) => string;
  donut?: boolean;
}

const DEFAULT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#a855f7',
];

export function PieChart({
  title,
  description,
  data,
  isLoading,
  height = 300,
  formatter,
  donut = true,
}: PieChartProps) {
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
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={donut ? 60 : 0}
                outerRadius={90}
                paddingAngle={2}
                label={({ name, value }) => `${name}: ${formatter ? formatter(value) : value}`}
                labelLine={false}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
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
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}