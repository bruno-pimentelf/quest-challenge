'use client';

import { useMemo } from 'react';
import type { RankingContent, RankingResponse } from '@/types';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface RankingResultsProps {
  content: RankingContent;
  responses: RankingResponse[];
}

const MEDAL_COLORS = {
  1: 'hsl(var(--chart-1))', // Gold
  2: 'hsl(var(--chart-2))', // Silver
  3: 'hsl(var(--chart-3))', // Bronze
};

export function RankingResults({ content, responses }: RankingResultsProps) {
  const averagePositions = useMemo(() => {
    if (responses.length === 0) {
      return content.items.map((item) => ({ item, averagePosition: 0, totalScore: 0 }));
    }

    const itemScores = new Map<string, number[]>();

    content.items.forEach((item) => {
      itemScores.set(item, []);
    });

    responses.forEach((response) => {
      response.ranking.forEach((item, position) => {
        const scores = itemScores.get(item);
        if (scores) {
          scores.push(position + 1);
        }
      });
    });

    return content.items
      .map((item) => {
        const scores = itemScores.get(item) || [];
        const averagePosition = scores.length > 0
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : 0;
        return {
          item,
          averagePosition: Number(averagePosition.toFixed(2)),
          totalScore: scores.length,
        };
      })
      .sort((a, b) => a.averagePosition - b.averagePosition);
  }, [content.items, responses]);

  const chartData = useMemo(() => {
    return averagePositions.map((data) => ({
      ...data,
      displayPosition: data.averagePosition || 0,
    }));
  }, [averagePositions]);

  const chartConfig: ChartConfig = {
    displayPosition: {
      label: 'Posição Média',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Title + Stats in one line */}
      <div className="flex items-center justify-between pb-3 border-b flex-shrink-0">
        <h2 className="text-2xl font-bold truncate">{content.title}</h2>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {responses.length} {responses.length === 1 ? 'resposta' : 'respostas'}
        </span>
      </div>

      {responses.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 animate-pulse">
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-sm text-muted-foreground">Aguardando respostas...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-3 min-h-0">
          {/* Ranking List - More horizontal space */}
          <div className="flex-1 grid grid-cols-2 gap-2 content-start overflow-y-auto pr-1">
            {averagePositions.map((data, index) => {
              const position = index + 1;
              const medalEmoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : null;
              const borderColor = position <= 3 ? MEDAL_COLORS[position as keyof typeof MEDAL_COLORS] : undefined;

              return (
                <div
                  key={data.item}
                  className="flex items-center gap-2 p-2 border rounded hover:border-primary/50 transition-all bg-card"
                  style={borderColor ? { borderColor } : undefined}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded font-bold text-sm flex-shrink-0"
                    style={{
                      backgroundColor: borderColor || 'hsl(var(--muted))',
                      color: position <= 3 ? 'white' : 'hsl(var(--foreground))'
                    }}
                  >
                    {medalEmoji || position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">{data.item}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Média: {data.averagePosition.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold" style={borderColor ? { color: borderColor } : undefined}>
                      {data.averagePosition.toFixed(1)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart - Smaller */}
          <div className="w-80 min-h-0 border rounded-lg">
            <ChartContainer config={chartConfig} className="h-full w-full p-2">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, content.items.length + 1]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  style={{ fontSize: '10px' }}
                />
                <YAxis
                  dataKey="item"
                  type="category"
                  width={80}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  style={{ fontSize: '10px' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="displayPosition"
                  fill="hsl(var(--chart-1))"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  );
}
