import type { DeckType } from "./deck";

// === Card Status ===
export type CardStatus = "New" | "Learning" | "Mastered";

// === User Settings ===
export interface UserSettingsDTO {
  dailyGoal: number;
  batchSize: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
}

export interface UpdateUserSettingsRequest {
  dailyGoal?: number;
  batchSize?: number;
}

// === Deck Queue ===
export interface DeckQueueDTO {
  deckId: string;
  deckName: string;
  deckType: DeckType;
  totalCards: number;
  learnedCards: number;
  dueForReview: number;
  addedAt: string;
}

export interface AddToQueueRequest {
  deckId: string;
}

// === Learn ===
export interface LearnCardDTO {
  cardId: string;
  cardType: DeckType;
  term: string;
  meaning: string;
  structure?: string;
  explanation?: string;
  caution?: string;
  hasExamples: boolean;
  examples: LearnExampleDTO[];
}

export interface LearnExampleDTO {
  id: string;
  clozeSentence: string;
  expectedAnswer: string;
  hint?: string;
}

export interface LearnBatchDTO {
  deckId: string;
  deckName: string;
  cards: LearnCardDTO[];
  totalNewCards: number;
  dailyProgress: DailyProgressDTO;
}

export interface MarkCardRequest {
  cardId: string;
  cardType: DeckType;
  isMastered: boolean;
}

export interface DailyProgressDTO {
  learnedToday: number;
  dailyGoal: number;
  isGoalReached: boolean;
  currentStreak: number;
}

// === Review ===
export interface ReviewItemDTO {
  cardProgressId: string;
  exampleSentenceId: string | null;
  reviewType: "Cloze" | "Flashcard";
  clozeSentence?: string;
  hint?: string;
  cardTerm: string;
  cardMeaning: string;
  srsLevel: number;
}

export interface ReviewSessionDTO {
  deckId: string;
  deckName: string;
  totalDue: number;
  items: ReviewItemDTO[];
}

export interface SubmitReviewRequest {
  cardProgressId: string;
  exampleSentenceId?: string;
  userAnswer?: string;
  isCorrect?: boolean;
  isGhost: boolean;
}

export interface ReviewResultDTO {
  isCorrect: boolean;
  expectedAnswer: string | null;
  newSrsLevel: number;
  nextReviewAt: string | null;
  isGhostEligible: boolean;
}

// === Deck Progress ===
export interface DeckProgressDTO {
  totalCards: number;
  newCards: number;
  learningCards: number;
  masteredCards: number;
  dueForReview: number;
  accuracyPercent: number;
}
