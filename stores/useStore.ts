'use client';

import { create } from 'zustand';
import type {
  Presentation,
  LiveSession,
  QuestionResponse,
  Question,
} from '@/types';

interface StoreState {
  // Presentations
  presentations: Presentation[];
  setPresentations: (presentations: Presentation[]) => void;
  addPresentation: (presentation: Presentation) => void;
  updatePresentation: (id: string, updates: Partial<Presentation>) => void;
  deletePresentation: (id: string) => void;

  // Live Session
  currentSession: LiveSession | null;
  setCurrentSession: (session: LiveSession | null) => void;
  updateCurrentSession: (updates: Partial<LiveSession>) => void;

  // Responses (real-time simulation)
  responses: QuestionResponse[];
  addResponse: (response: QuestionResponse) => void;
  clearResponses: () => void;

  // Student ID (persisted for the session)
  studentId: string | null;
  setStudentId: (id: string) => void;

  // Current presentation being viewed/edited
  currentPresentation: Presentation | null;
  setCurrentPresentation: (presentation: Presentation | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Presentations
  presentations: [],
  setPresentations: (presentations) => set({ presentations }),
  addPresentation: (presentation) =>
    set((state) => ({
      presentations: [...state.presentations, presentation],
    })),
  updatePresentation: (id, updates) =>
    set((state) => ({
      presentations: state.presentations.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
      currentPresentation:
        state.currentPresentation?.id === id
          ? { ...state.currentPresentation, ...updates, updatedAt: new Date() }
          : state.currentPresentation,
    })),
  deletePresentation: (id) =>
    set((state) => ({
      presentations: state.presentations.filter((p) => p.id !== id),
    })),

  // Live Session
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),
  updateCurrentSession: (updates) =>
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, ...updates }
        : null,
    })),

  // Responses
  responses: [],
  addResponse: (response) =>
    set((state) => ({
      responses: [...state.responses, response],
    })),
  clearResponses: () => set({ responses: [] }),

  // Student ID
  studentId: null,
  setStudentId: (id) => set({ studentId: id }),

  // Current presentation
  currentPresentation: null,
  setCurrentPresentation: (presentation) =>
    set({ currentPresentation: presentation }),
}));
