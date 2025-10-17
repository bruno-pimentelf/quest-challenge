'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getLiveSessionByRoomCode,
  getPresentationById,
  updateLiveSession,
  getResponsesByRoomCode,
  endLiveSession,
} from '@/services/api';
import type {
  LiveSession,
  Presentation,
  MultipleChoiceResponse,
  WordCloudResponse,
  RankingResponse,
  QuestionResponse,
} from '@/types';
import { Button } from '@/components/ui/button';
import { MultipleChoiceResults } from '@/components/questions/MultipleChoiceResults';
import { WordCloudResults } from '@/components/questions/WordCloudResults';
import { RankingResults } from '@/components/questions/RankingResults';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Copy,
  Check,
} from 'lucide-react';

export default function LivePresentationPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const [session, setSession] = useState<LiveSession | null>(null);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSessionData();

    const interval = setInterval(() => {
      loadResponses();
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  const loadSessionData = async () => {
    try {
      const sessionData = await getLiveSessionByRoomCode(roomCode);

      if (!sessionData) {
        router.push('/dashboard');
        return;
      }

      setSession(sessionData);

      const presentationData = await getPresentationById(sessionData.presentationId);
      if (presentationData) {
        setPresentation(presentationData);
      }

      await loadResponses();
      setLoading(false);
    } catch (error) {
      console.error('Error loading session:', error);
      router.push('/dashboard');
    }
  };

  const loadResponses = async () => {
    try {
      const responsesData = await getResponsesByRoomCode(roomCode);
      setResponses(responsesData);
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const handlePreviousQuestion = async () => {
    if (!session || session.currentQuestionIndex === 0) return;

    const newIndex = session.currentQuestionIndex - 1;
    await updateLiveSession(roomCode, { currentQuestionIndex: newIndex });
    setSession({ ...session, currentQuestionIndex: newIndex });
  };

  const handleNextQuestion = async () => {
    if (!session || !presentation) return;
    if (session.currentQuestionIndex >= presentation.questions.length - 1) return;

    const newIndex = session.currentQuestionIndex + 1;
    await updateLiveSession(roomCode, { currentQuestionIndex: newIndex });
    setSession({ ...session, currentQuestionIndex: newIndex });
  };

  const handleEndSession = async () => {
    if (!confirm('Tem certeza que deseja encerrar esta sessão?')) return;

    await endLiveSession(roomCode);
    router.push('/dashboard');
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentQuestion = useMemo(() => {
    if (!session || !presentation) return null;
    return presentation.questions[session.currentQuestionIndex];
  }, [session, presentation]);

  const currentQuestionResponses = useMemo(() => {
    if (!currentQuestion) return [];
    return responses.filter((r) => r.questionId === currentQuestion.id);
  }, [responses, currentQuestion]);

  const uniqueRespondents = useMemo(() => {
    const studentIds = new Set(responses.map((r) => r.studentId));
    return studentIds.size;
  }, [responses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!session || !presentation || !currentQuestion) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Ultra Compact Header */}
      <div className="border-b bg-card/90 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base font-bold truncate">{presentation.title}</h1>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                {session.currentQuestionIndex + 1}/{presentation.questions.length}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {uniqueRespondents}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              className="px-2 py-1 font-mono font-bold text-xs border rounded hover:bg-primary/5 transition-all"
              onClick={handleCopyRoomCode}
            >
              {roomCode}
              {copied ? <Check className="inline h-3 w-3 ml-1 text-green-600" /> : <Copy className="inline h-3 w-3 ml-1" />}
            </button>

            <Button variant="destructive" size="sm" onClick={handleEndSession} className="h-7 text-xs px-2">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Full Height */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full container mx-auto px-4 py-2">
          <div className="h-full flex flex-col">
            {currentQuestion.type === 'MULTIPLE_CHOICE' &&
              currentQuestion.content.type === 'MULTIPLE_CHOICE' && (
                <MultipleChoiceResults
                  content={currentQuestion.content.data}
                  responses={currentQuestionResponses as MultipleChoiceResponse[]}
                />
              )}

            {currentQuestion.type === 'WORD_CLOUD' &&
              currentQuestion.content.type === 'WORD_CLOUD' && (
                <WordCloudResults
                  content={currentQuestion.content.data}
                  responses={currentQuestionResponses as WordCloudResponse[]}
                />
              )}

            {currentQuestion.type === 'RANKING' &&
              currentQuestion.content.type === 'RANKING' && (
                <RankingResults
                  content={currentQuestion.content.data}
                  responses={currentQuestionResponses as RankingResponse[]}
                />
              )}

            {/* Ultra Compact Navigation Footer */}
            <div className="flex justify-between items-center pt-2 border-t flex-shrink-0 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousQuestion}
                disabled={session.currentQuestionIndex === 0}
                className="h-7 text-xs disabled:opacity-50"
              >
                <ChevronLeft className="mr-1 h-3 w-3" />
                Anterior
              </Button>

              <div className="flex gap-1.5 items-center">
                {presentation.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === session.currentQuestionIndex
                        ? 'bg-primary w-6'
                        : index < session.currentQuestionIndex
                        ? 'bg-primary/50 w-1.5'
                        : 'bg-muted w-1.5'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextQuestion}
                disabled={session.currentQuestionIndex >= presentation.questions.length - 1}
                className="h-7 text-xs disabled:opacity-50"
              >
                Próxima
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
