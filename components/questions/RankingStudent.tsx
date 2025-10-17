'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { RankingContent } from '@/types';
import { Check, GripVertical } from 'lucide-react';

interface RankingStudentProps {
  content: RankingContent;
  onSubmit: (ranking: string[]) => void;
}

function SortableItem({ id, item }: { id: string; item: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-card border rounded-lg cursor-move hover:bg-accent"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <span className="flex-1 font-medium">{item}</span>
    </div>
  );
}

export function RankingStudent({ content, onSubmit }: RankingStudentProps) {
  const [items, setItems] = useState(content.items);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onSubmit(items);
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
      <h2 className="text-3xl font-bold text-center mb-4">{content.title}</h2>
      <p className="text-center text-muted-foreground mb-8">
        Arraste os itens para ordená-los por preferência (do mais preferido para o
        menos preferido)
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <SortableItem id={item} item={item} />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button size="lg" className="w-full" onClick={handleSubmit}>
        Enviar Resposta
      </Button>
    </div>
  );
}
