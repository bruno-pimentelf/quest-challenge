import type { Presentation, LiveSession, QuestionResponse, Question } from '@/types';
import {
  mockPresentations,
  mockLiveSessions,
  mockResponses,
  generateRoomCode,
} from '@/mock-data/db';

// Simulates network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Presentation APIs
export const getPresentations = async (): Promise<Presentation[]> => {
  console.log('[API MOCK] Fetching all presentations');
  await delay(300);
  return [...mockPresentations];
};

export const getPresentationById = async (id: string): Promise<Presentation | null> => {
  console.log(`[API MOCK] Fetching presentation with id: ${id}`);
  await delay(300);
  const presentation = mockPresentations.find((p) => p.id === id);
  return presentation ? { ...presentation } : null;
};

export const createPresentation = async (title: string): Promise<Presentation> => {
  console.log(`[API MOCK] Creating presentation: ${title}`);
  await delay(500);

  const newPresentation: Presentation = {
    id: `pres-${Date.now()}`,
    title,
    questions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockPresentations.push(newPresentation);
  return { ...newPresentation };
};

export const updatePresentation = async (
  id: string,
  updates: Partial<Presentation>
): Promise<Presentation | null> => {
  console.log(`[API MOCK] Updating presentation ${id}`, updates);
  await delay(500);

  const index = mockPresentations.findIndex((p) => p.id === id);
  if (index === -1) return null;

  mockPresentations[index] = {
    ...mockPresentations[index],
    ...updates,
    updatedAt: new Date(),
  };

  return { ...mockPresentations[index] };
};

export const deletePresentation = async (id: string): Promise<boolean> => {
  console.log(`[API MOCK] Deleting presentation ${id}`);
  await delay(300);

  const index = mockPresentations.findIndex((p) => p.id === id);
  if (index === -1) return false;

  mockPresentations.splice(index, 1);
  return true;
};

// Live Session APIs
export const startLiveSession = async (presentationId: string): Promise<LiveSession> => {
  console.log(`[API MOCK] Starting live session for presentation ${presentationId}`);
  await delay(500);

  const roomCode = generateRoomCode();
  const newSession: LiveSession = {
    id: `session-${Date.now()}`,
    roomCode,
    presentationId,
    currentQuestionIndex: 0,
    responses: [],
    isActive: true,
    startedAt: new Date(),
  };

  mockLiveSessions.push(newSession);
  mockResponses.set(roomCode, []);

  return { ...newSession };
};

export const getLiveSessionByRoomCode = async (
  roomCode: string
): Promise<LiveSession | null> => {
  console.log(`[API MOCK] Fetching live session with room code: ${roomCode}`);
  await delay(200);

  const session = mockLiveSessions.find((s) => s.roomCode === roomCode);
  return session ? { ...session } : null;
};

export const updateLiveSession = async (
  roomCode: string,
  updates: Partial<LiveSession>
): Promise<LiveSession | null> => {
  console.log(`[API MOCK] Updating live session ${roomCode}`, updates);
  await delay(200);

  const index = mockLiveSessions.findIndex((s) => s.roomCode === roomCode);
  if (index === -1) return null;

  mockLiveSessions[index] = {
    ...mockLiveSessions[index],
    ...updates,
  };

  return { ...mockLiveSessions[index] };
};

export const endLiveSession = async (roomCode: string): Promise<boolean> => {
  console.log(`[API MOCK] Ending live session ${roomCode}`);
  await delay(300);

  const index = mockLiveSessions.findIndex((s) => s.roomCode === roomCode);
  if (index === -1) return false;

  mockLiveSessions[index].isActive = false;
  return true;
};

// Response APIs
export const submitResponse = async (
  roomCode: string,
  response: QuestionResponse
): Promise<boolean> => {
  console.log(`[API MOCK] Submitting response for room ${roomCode}`, response);
  await delay(300);

  const responses = mockResponses.get(roomCode);
  if (!responses) return false;

  responses.push(response);

  // Also add to the session
  const session = mockLiveSessions.find((s) => s.roomCode === roomCode);
  if (session) {
    session.responses.push(response);
  }

  return true;
};

export const getResponsesByRoomCode = async (
  roomCode: string
): Promise<QuestionResponse[]> => {
  console.log(`[API MOCK] Fetching responses for room ${roomCode}`);
  await delay(200);

  const responses = mockResponses.get(roomCode);
  return responses ? [...responses] : [];
};
