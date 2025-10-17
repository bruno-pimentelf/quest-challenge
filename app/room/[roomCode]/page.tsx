'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/stores/useStore';
import {
  getLiveSessionByRoomCode,
  getPresentationById,
  submitResponse,
} from '@/services/api';
import { generateStudentId } from '@/mock-data/db';
import type { Presentation } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MultipleChoiceStudent } from '@/components/questions/MultipleChoiceStudent';
import { WordCloudStudent } from '@/components/questions/WordCloudStudent';
import { RankingStudent } from '@/components/questions/RankingStudent';
import { Loader2 } from 'lucide-react';

export default function StudentRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const { studentId, setStudentId, currentSession, setCurrentSession } = useStore();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) {
      const newStudentId = generateStudentId();
      setStudentId(newStudentId);
    }
  }, [studentId, setStudentId]);

  useEffect(() => {
    loadSession();

    const interval = setInterval(() => {
      loadSession();
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  const loadSession = async () => {
    try {
      const session = await getLiveSessionByRoomCode(roomCode);

      if (!session) {
        setError('Sala não encontrada. Verifique o código e tente novamente.');
        setLoading(false);
        return;
      }

      if (!session.isActive) {
        setError('Esta sessão foi encerrada pelo professor.');
        setLoading(false);
        return;
      }

      setCurrentSession(session);

      if (!presentation || presentation.id !== session.presentationId) {
        const presentationData = await getPresentationById(session.presentationId);
        if (presentationData) {
          setPresentation(presentationData);
        }
      }

      setLoading(false);
      setError('');
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Erro ao carregar a sessão.');
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (
    questionId: string,
    response: { selectedOption?: number; words?: string[]; ranking?: string[] }
  ) => {
    if (!studentId || !currentSession) return;

    const question = presentation?.questions.find((q) => q.id === questionId);
    if (!question) return;

    let responseData;

    if ('selectedOption' in response && question.type === 'MULTIPLE_CHOICE') {
      responseData = {
        questionId,
        studentId,
        selectedOption: response.selectedOption!,
        timestamp: new Date(),
      };
    } else if ('words' in response && question.type === 'WORD_CLOUD') {
      responseData = {
        questionId,
        studentId,
        words: response.words!,
        timestamp: new Date(),
      };
    } else if ('ranking' in response && question.type === 'RANKING') {
      responseData = {
        questionId,
        studentId,
        ranking: response.ranking!,
        timestamp: new Date(),
      };
    }

    if (responseData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await submitResponse(roomCode, responseData as any);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="text-center space-y-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-xl font-medium">Conectando à sala...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-sm text-muted-foreground">Aguarde um momento</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 p-6">
        <Card className="p-12 text-center max-w-md shadow-2xl border-2">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Erro</h2>
          <p className="text-muted-foreground text-lg mb-8">{error}</p>
          <Button
            onClick={() => router.push('/join')}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all"
          >
            Voltar para Entrada
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentSession || !presentation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="text-center space-y-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-xl font-medium">Carregando...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-sm text-muted-foreground">Preparando a sala</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = presentation.questions[currentSession.currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 p-6">
        <Card className="p-16 text-center max-w-lg shadow-2xl border-2">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Aguardando...</h2>
          <p className="text-muted-foreground text-lg mb-6">
            O professor irá iniciar a apresentação em breve.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Sala: <span className="font-mono font-bold">{roomCode}</span></span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 p-6">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-8 space-y-4">
          <div className="bg-card/50 backdrop-blur-sm border-2 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg" />
                <div>
                  <p className="text-sm text-muted-foreground">Sala</p>
                  <p className="text-xl font-mono font-bold tracking-wider">{roomCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Pergunta</p>
                  <p className="text-xl font-bold">
                    {currentSession.currentQuestionIndex + 1} / {presentation.questions.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: presentation.questions.length }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSession.currentQuestionIndex
                          ? 'bg-primary w-6'
                          : index < currentSession.currentQuestionIndex
                          ? 'bg-primary/50'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-10 shadow-2xl border-2 hover:border-primary/30 transition-colors">
          {currentQuestion.type === 'MULTIPLE_CHOICE' &&
            currentQuestion.content.type === 'MULTIPLE_CHOICE' && (
              <MultipleChoiceStudent
                content={currentQuestion.content.data}
                onSubmit={(selectedOption) =>
                  handleSubmitResponse(currentQuestion.id, { selectedOption })
                }
              />
            )}

          {currentQuestion.type === 'WORD_CLOUD' &&
            currentQuestion.content.type === 'WORD_CLOUD' && (
              <WordCloudStudent
                content={currentQuestion.content.data}
                onSubmit={(words) =>
                  handleSubmitResponse(currentQuestion.id, { words })
                }
              />
            )}

          {currentQuestion.type === 'RANKING' &&
            currentQuestion.content.type === 'RANKING' && (
              <RankingStudent
                content={currentQuestion.content.data}
                onSubmit={(ranking) =>
                  handleSubmitResponse(currentQuestion.id, { ranking })
                }
              />
            )}
        </Card>
      </div>
    </div>
  );
}
