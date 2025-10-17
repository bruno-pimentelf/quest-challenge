'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { WordCloudContent } from '@/types';
import { Check } from 'lucide-react';

interface WordCloudStudentProps {
  content: WordCloudContent;
  onSubmit: (words: string[]) => void;
}

export function WordCloudStudent({
  content,
  onSubmit,
}: WordCloudStudentProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    const words = inputValue
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    setIsSubmitted(true);
    onSubmit(words);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Resposta Enviada!</h3>
        <p className="text-muted-foreground">
          Aguarde a próxima pergunta...
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>

      <div className="space-y-4">
        <div className="text-center text-muted-foreground">
          Digite uma ou mais palavras (separadas por espaços)
        </div>

        <Input
          type="text"
          placeholder="Digite suas palavras aqui..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-lg p-6"
          autoFocus
        />

        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
        >
          Enviar Resposta
        </Button>
      </div>
    </div>
  );
}
