'use client';

import { useMemo } from 'react';
import type { MultipleChoiceContent, MultipleChoiceResponse } from '@/types';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface MultipleChoiceResultsProps {
  content: MultipleChoiceContent;
  responses: MultipleChoiceResponse[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function MultipleChoiceResults({
  content,
  responses,
}: MultipleChoiceResultsProps) {
  const { chartData, chartConfig } = useMemo(() => {
    const counts = new Array(content.options.length).fill(0);

    responses.forEach((response) => {
      if (response.selectedOption < counts.length) {
        counts[response.selectedOption]++;
      }
    });

    const data = content.options.map((option, index) => ({
      option: String.fromCharCode(65 + index),
      label: option,
      count: counts[index],
      percentage: responses.length > 0
        ? ((counts[index] / responses.length) * 100).toFixed(1)
        : '0',
      fill: COLORS[index % COLORS.length],
    }));

    const config: ChartConfig = content.options.reduce((acc, option, index) => {
      const optionKey = String.fromCharCode(65 + index);
      acc[optionKey] = {
        label: option,
        color: COLORS[index % COLORS.length],
      };
      return acc;
    }, {} as ChartConfig);

    return { chartData: data, chartConfig: config };
  }, [content.options, responses]);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Title + Stats in one line */}
      <div className="flex items-center justify-between pb-3 border-b flex-shrink-0">
        <h2 className="text-2xl font-bold truncate">{content.title}</h2>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {responses.length} {responses.length === 1 ? 'resposta' : 'respostas'}
        </span>
      </div>

      {/* Main content: Chart + All options in horizontal cards */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Chart */}
        <div className="flex-1 min-w-0">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="option"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                style={{ fontSize: '11px', fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                style={{ fontSize: '10px' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Options - Horizontal grid */}
        <div className="w-80 grid grid-cols-1 gap-1.5 content-start overflow-y-auto pr-1">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 border rounded-md hover:border-primary/50 transition-all bg-card"
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: item.fill }}
              >
                {item.option}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex-1 bg-muted rounded-full h-1">
                    <div
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.fill
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">{item.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
