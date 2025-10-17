'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { MultipleChoiceContent } from '@/types';
import { Check } from 'lucide-react';

interface MultipleChoiceStudentProps {
  content: MultipleChoiceContent;
  onSubmit: (selectedOption: number) => void;
}

export function MultipleChoiceStudent({
  content,
  onSubmit,
}: MultipleChoiceStudentProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    onSubmit(selectedOption);
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

      <div className="grid gap-4">
        {content.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedOption === index ? 'default' : 'outline'}
            size="lg"
            className="h-auto py-6 text-lg justify-start"
            onClick={() => setSelectedOption(index)}
          >
            <span className="mr-4 font-bold">{String.fromCharCode(65 + index)}.</span>
            {option}
          </Button>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={selectedOption === null}
      >
        Enviar Resposta
      </Button>
    </div>
  );
}
