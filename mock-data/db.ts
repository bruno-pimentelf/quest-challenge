import type { Presentation, LiveSession, QuestionResponse } from '@/types';

// Mock presentations database
export const mockPresentations: Presentation[] = [
  {
    id: 'pres-1',
    title: 'Quiz de Conhecimentos Gerais',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    questions: [
      {
        id: 'q-1',
        type: 'MULTIPLE_CHOICE',
        content: {
          type: 'MULTIPLE_CHOICE',
          data: {
            title: 'Qual é o seu framework JavaScript favorito?',
            options: ['React', 'Vue', 'Angular', 'Svelte'],
          },
        },
      },
      {
        id: 'q-2',
        type: 'WORD_CLOUD',
        content: {
          type: 'WORD_CLOUD',
          data: {
            title: 'Descreva este evento em uma palavra',
          },
        },
      },
      {
        id: 'q-3',
        type: 'RANKING',
        content: {
          type: 'RANKING',
          data: {
            title: 'Ordene estas tecnologias por preferência',
            items: ['Next.js', 'Prisma', 'Tailwind CSS', 'TypeScript'],
          },
        },
      },
    ],
  },
  {
    id: 'pres-2',
    title: 'Pesquisa de Satisfação do Curso',
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-02-15'),
    questions: [
      {
        id: 'q-4',
        type: 'MULTIPLE_CHOICE',
        content: {
          type: 'MULTIPLE_CHOICE',
          data: {
            title: 'Como você avalia o conteúdo do curso?',
            options: ['Excelente', 'Bom', 'Regular', 'Ruim'],
          },
        },
      },
      {
        id: 'q-5',
        type: 'WORD_CLOUD',
        content: {
          type: 'WORD_CLOUD',
          data: {
            title: 'O que você mais gostou no curso?',
          },
        },
      },
    ],
  },
  {
    id: 'pres-3',
    title: 'Avaliação de Produtos',
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-01'),
    questions: [
      {
        id: 'q-6',
        type: 'RANKING',
        content: {
          type: 'RANKING',
          data: {
            title: 'Ordene estes produtos por preferência',
            items: ['Produto A', 'Produto B', 'Produto C', 'Produto D'],
          },
        },
      },
    ],
  },
];

// Mock live sessions database
export const mockLiveSessions: LiveSession[] = [
  {
    id: 'session-demo',
    roomCode: 'DEMO01',
    presentationId: 'pres-1',
    currentQuestionIndex: 0,
    responses: [],
    isActive: true,
    startedAt: new Date(),
  },
];

// Mock responses database
export const mockResponses: Map<string, QuestionResponse[]> = new Map([
  ['DEMO01', []],
]);

// Helper function to generate a unique room code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper function to generate a unique student ID
export function generateStudentId(): string {
  return `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
