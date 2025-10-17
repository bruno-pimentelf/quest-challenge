'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPresentationById, updatePresentation } from '@/services/api';
import type { Presentation, Question, QuestionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, PlusCircle, Trash2, GripVertical } from 'lucide-react';

export default function PresentationEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('MULTIPLE_CHOICE');

  useEffect(() => {
    loadPresentation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPresentation = async () => {
    try {
      const data = await getPresentationById(id);
      if (!data) {
        router.push('/dashboard');
        return;
      }
      setPresentation(data);
    } catch (error) {
      console.error('Error loading presentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePresentation = async (updates: Partial<Presentation>) => {
    if (!presentation) return;

    setIsSaving(true);
    try {
      await updatePresentation(presentation.id, updates);
      setPresentation({ ...presentation, ...updates });
    } catch (error) {
      console.error('Error saving presentation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (title: string) => {
    if (!presentation) return;
    setPresentation({ ...presentation, title });
  };

  const handleTitleBlur = () => {
    if (!presentation) return;
    savePresentation({ title: presentation.title });
  };

  const handleAddQuestion = () => {
    if (!presentation) return;

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: newQuestionType,
      content:
        newQuestionType === 'MULTIPLE_CHOICE'
          ? {
              type: 'MULTIPLE_CHOICE',
              data: {
                title: 'Nova pergunta de múltipla escolha',
                options: ['Opção 1', 'Opção 2', 'Opção 3'],
              },
            }
          : newQuestionType === 'WORD_CLOUD'
          ? {
              type: 'WORD_CLOUD',
              data: {
                title: 'Nova pergunta de nuvem de palavras',
              },
            }
          : {
              type: 'RANKING',
              data: {
                title: 'Nova pergunta de ranking',
                items: ['Item 1', 'Item 2', 'Item 3'],
              },
            },
    };

    const updatedQuestions = [...presentation.questions, newQuestion];
    setPresentation({ ...presentation, questions: updatedQuestions });
    savePresentation({ questions: updatedQuestions });
    setIsAddQuestionDialogOpen(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!presentation) return;
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;

    const updatedQuestions = presentation.questions.filter((q) => q.id !== questionId);
    setPresentation({ ...presentation, questions: updatedQuestions });
    savePresentation({ questions: updatedQuestions });
  };

  const handleUpdateQuestionTitle = (questionId: string, title: string) => {
    if (!presentation) return;

    const updatedQuestions = presentation.questions.map((q) => {
      if (q.id !== questionId) return q;

      if (q.content.type === 'MULTIPLE_CHOICE') {
        return {
          ...q,
          content: {
            ...q.content,
            data: { ...q.content.data, title },
          },
        };
      } else if (q.content.type === 'WORD_CLOUD') {
        return {
          ...q,
          content: {
            ...q.content,
            data: { ...q.content.data, title },
          },
        };
      } else {
        return {
          ...q,
          content: {
            ...q.content,
            data: { ...q.content.data, title },
          },
        };
      }
    });

    setPresentation({ ...presentation, questions: updatedQuestions });
  };

  const handleUpdateQuestionTitleBlur = () => {
    if (!presentation) return;
    savePresentation({ questions: presentation.questions });
  };

  const handleUpdateMultipleChoiceOptions = (
    questionId: string,
    options: string[]
  ) => {
    if (!presentation) return;

    const updatedQuestions = presentation.questions.map((q) => {
      if (q.id !== questionId || q.content.type !== 'MULTIPLE_CHOICE') return q;

      return {
        ...q,
        content: {
          ...q.content,
          data: { ...q.content.data, options },
        },
      };
    });

    setPresentation({ ...presentation, questions: updatedQuestions });
    savePresentation({ questions: updatedQuestions });
  };

  const handleUpdateRankingItems = (questionId: string, items: string[]) => {
    if (!presentation) return;

    const updatedQuestions = presentation.questions.map((q) => {
      if (q.id !== questionId || q.content.type !== 'RANKING') return q;

      return {
        ...q,
        content: {
          ...q.content,
          data: { ...q.content.data, items },
        },
      };
    });

    setPresentation({ ...presentation, questions: updatedQuestions });
    savePresentation({ questions: updatedQuestions });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!presentation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-6 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="presentation-title" className="text-base font-medium">
                Título da Apresentação
              </Label>
              <Input
                id="presentation-title"
                value={presentation.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={handleTitleBlur}
                className="text-3xl font-bold h-auto py-4 border-2 focus:border-primary transition-colors"
                placeholder="Título da apresentação"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
              <p className="text-sm text-muted-foreground">
                {isSaving ? 'Salvando...' : 'Salvo automaticamente'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Perguntas</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {presentation.questions.length} {presentation.questions.length === 1 ? 'pergunta' : 'perguntas'}
              </p>
            </div>
            <Button
              onClick={() => setIsAddQuestionDialogOpen(true)}
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Pergunta
            </Button>
          </div>

          {presentation.questions.length === 0 ? (
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center space-y-4 py-16">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <PlusCircle className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Nenhuma pergunta ainda</CardTitle>
                <CardDescription className="text-base">
                  Adicione perguntas para criar sua apresentação interativa
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-6">
              {presentation.questions.map((question, index) => (
                <Card
                  key={question.id}
                  className="group border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{index + 1}</span>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted rounded-full">
                              {question.type === 'MULTIPLE_CHOICE'
                                ? 'Múltipla Escolha'
                                : question.type === 'WORD_CLOUD'
                                ? 'Nuvem de Palavras'
                                : 'Ranking'}
                            </span>
                          </div>
                        </div>
                        <Input
                          value={question.content.data.title}
                          onChange={(e) =>
                            handleUpdateQuestionTitle(question.id, e.target.value)
                          }
                          onBlur={() => handleUpdateQuestionTitleBlur()}
                          className="text-xl font-semibold h-auto py-3 border-2 focus:border-primary transition-colors"
                          placeholder="Título da pergunta"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    {question.content.type === 'MULTIPLE_CHOICE' && 'options' in question.content.data && (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Opções de Resposta</Label>
                        <div className="space-y-3">
                          {(question.content.data as { title: string; options: string[] }).options.map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className="flex gap-3 items-center">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold">{String.fromCharCode(65 + optionIndex)}</span>
                              </div>
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const data = question.content.data as { title: string; options: string[] };
                                  const newOptions = [...data.options];
                                  newOptions[optionIndex] = e.target.value;
                                  handleUpdateMultipleChoiceOptions(
                                    question.id,
                                    newOptions
                                  );
                                }}
                                placeholder={`Opção ${optionIndex + 1}`}
                                className="border-2 focus:border-primary transition-colors"
                              />
                              {(question.content.data as { title: string; options: string[] }).options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const data = question.content.data as { title: string; options: string[] };
                                    const newOptions = data.options.filter(
                                      (_: string, i: number) => i !== optionIndex
                                    );
                                    handleUpdateMultipleChoiceOptions(
                                      question.id,
                                      newOptions
                                    );
                                  }}
                                  className="hover:bg-destructive hover:text-destructive-foreground transition-colors flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const data = question.content.data as { title: string; options: string[] };
                            const newOptions = [
                              ...data.options,
                              `Opção ${data.options.length + 1}`,
                            ];
                            handleUpdateMultipleChoiceOptions(question.id, newOptions);
                          }}
                          className="mt-2"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Adicionar Opção
                        </Button>
                      </div>
                    )}

                    {question.content.type === 'WORD_CLOUD' && (
                      <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
                        <p className="text-sm text-muted-foreground flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs">ℹ</span>
                          </div>
                          <span>
                            Os alunos digitarão palavras que serão exibidas em uma nuvem de palavras interativa em tempo real.
                          </span>
                        </p>
                      </div>
                    )}

                    {question.content.type === 'RANKING' && 'items' in question.content.data && (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Itens para Ordenar</Label>
                        <div className="space-y-3">
                          {(question.content.data as { title: string; items: string[] }).items.map((item: string, itemIndex: number) => (
                            <div key={itemIndex} className="flex gap-3 items-center">
                              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0" />
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold">{itemIndex + 1}</span>
                              </div>
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const data = question.content.data as { title: string; items: string[] };
                                  const newItems = [...data.items];
                                  newItems[itemIndex] = e.target.value;
                                  handleUpdateRankingItems(question.id, newItems);
                                }}
                                placeholder={`Item ${itemIndex + 1}`}
                                className="border-2 focus:border-primary transition-colors"
                              />
                              {(question.content.data as { title: string; items: string[] }).items.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const data = question.content.data as { title: string; items: string[] };
                                    const newItems = data.items.filter(
                                      (_: string, i: number) => i !== itemIndex
                                    );
                                    handleUpdateRankingItems(question.id, newItems);
                                  }}
                                  className="hover:bg-destructive hover:text-destructive-foreground transition-colors flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const data = question.content.data as { title: string; items: string[] };
                            const newItems = [
                              ...data.items,
                              `Item ${data.items.length + 1}`,
                            ];
                            handleUpdateRankingItems(question.id, newItems);
                          }}
                          className="mt-2"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Adicionar Item
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Pergunta</DialogTitle>
              <DialogDescription>
                Escolha o tipo de pergunta que deseja adicionar
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Tipo de Pergunta</Label>
                <Select
                  value={newQuestionType}
                  onValueChange={(value) => setNewQuestionType(value as QuestionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MULTIPLE_CHOICE">Múltipla Escolha</SelectItem>
                    <SelectItem value="WORD_CLOUD">Nuvem de Palavras</SelectItem>
                    <SelectItem value="RANKING">Ranking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddQuestionDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddQuestion}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
