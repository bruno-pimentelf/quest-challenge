'use client';

import { useMemo } from 'react';
import type { WordCloudContent, WordCloudResponse } from '@/types';

interface WordCloudResultsProps {
  content: WordCloudContent;
  responses: WordCloudResponse[];
}

const CLOUD_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function WordCloudResults({
  content,
  responses,
}: WordCloudResultsProps) {
  const wordFrequencies = useMemo(() => {
    const frequencies = new Map<string, number>();

    responses.forEach((response) => {
      response.words.forEach((word) => {
        const normalizedWord = word.toLowerCase().trim();
        if (normalizedWord) {
          frequencies.set(normalizedWord, (frequencies.get(normalizedWord) || 0) + 1);
        }
      });
    });

    return Array.from(frequencies.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);
  }, [responses]);

  const maxCount = wordFrequencies[0]?.count || 1;
  const totalWords = useMemo(() => {
    return wordFrequencies.reduce((sum, { count }) => sum + count, 0);
  }, [wordFrequencies]);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Title + Stats in one line */}
      <div className="flex items-center justify-between pb-2 border-b flex-shrink-0">
        <h2 className="text-lg font-bold truncate">{content.title}</h2>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {responses.length} respostas • {totalWords} palavras
        </span>
      </div>

      {wordFrequencies.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 animate-pulse">
              <span className="text-2xl">💭</span>
            </div>
            <p className="text-sm text-muted-foreground">Aguardando respostas...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-3 min-h-0">
          {/* Word Cloud - Large */}
          <div className="flex-1 min-h-0 border rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
            <div className="h-full flex flex-wrap items-center justify-center gap-3 p-4 overflow-y-auto">
              {wordFrequencies.map(({ word, count }, index) => {
                const fontSize = 14 + (count / maxCount) * 40;
                const weight = 400 + Math.floor((count / maxCount) * 500);

                return (
                  <span
                    key={index}
                    className="cursor-pointer transition-all duration-200 hover:scale-110 select-none"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight: weight,
                      color: CLOUD_COLORS[index % CLOUD_COLORS.length],
                      animation: `fadeIn 0.3s ease-in-out ${index * 0.03}s both`,
                    }}
                    title={`${word}: ${count}× (${((count / totalWords) * 100).toFixed(1)}%)`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Top Words - Compact grid */}
          <div className="w-64 grid grid-cols-1 gap-1 content-start overflow-y-auto pr-1">
            {wordFrequencies.slice(0, 15).map(({ word, count }, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1.5 border rounded hover:border-primary/50 transition-all bg-card"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                    style={{ backgroundColor: CLOUD_COLORS[index % CLOUD_COLORS.length] }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{word}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 bg-muted rounded-full h-0.5">
                        <div
                          className="h-0.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${(count / maxCount) * 100}%`,
                            backgroundColor: CLOUD_COLORS[index % CLOUD_COLORS.length]
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold whitespace-nowrap">{count}×</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
