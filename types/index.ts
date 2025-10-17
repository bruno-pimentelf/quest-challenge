// Core domain types for the Teachy platform

export type QuestionType = 'MULTIPLE_CHOICE' | 'WORD_CLOUD' | 'RANKING';

export interface MultipleChoiceContent {
  title: string;
  options: string[];
}

export interface WordCloudContent {
  title: string;
}

export interface RankingContent {
  title: string;
  items: string[];
}

export type QuestionContent =
  | { type: 'MULTIPLE_CHOICE'; data: MultipleChoiceContent }
  | { type: 'WORD_CLOUD'; data: WordCloudContent }
  | { type: 'RANKING'; data: RankingContent };

export interface Question {
  id: string;
  type: QuestionType;
  content: QuestionContent;
}

export interface Presentation {
  id: string;
  title: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

// Response types
export interface MultipleChoiceResponse {
  questionId: string;
  studentId: string;
  selectedOption: number; // index of the option
  timestamp: Date;
}

export interface WordCloudResponse {
  questionId: string;
  studentId: string;
  words: string[];
  timestamp: Date;
}

export interface RankingResponse {
  questionId: string;
  studentId: string;
  ranking: string[]; // ordered list of items
  timestamp: Date;
}

export type QuestionResponse =
  | MultipleChoiceResponse
  | WordCloudResponse
  | RankingResponse;

// Live session types
export interface LiveSession {
  id: string;
  roomCode: string;
  presentationId: string;
  currentQuestionIndex: number;
  responses: QuestionResponse[];
  isActive: boolean;
  startedAt: Date;
}

// Results aggregation types
export interface MultipleChoiceResults {
  questionId: string;
  optionCounts: number[]; // count for each option
  totalResponses: number;
}

export interface WordCloudResults {
  questionId: string;
  wordFrequencies: { word: string; count: number }[];
  totalResponses: number;
}

export interface RankingResults {
  questionId: string;
  itemScores: { item: string; averagePosition: number }[];
  totalResponses: number;
}

export type QuestionResults =
  | MultipleChoiceResults
  | WordCloudResults
  | RankingResults;
