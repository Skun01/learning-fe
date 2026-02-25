/**
 * Deck & Card DTOs — matches backend contracts
 */

// === Enum ===
export type DeckType = "Vocabulary" | "Grammar";

// === Shared ===
export interface Author {
  id: string;
  username: string;
}

// === Deck ===
export interface DeckSummaryDTO {
  id: string;
  name: string;
  type: DeckType;
  cardNumber: number;
  author: Author;
}

export interface DeckDTO {
  id: string;
  name: string;
  description: string;
  type: DeckType;
  author: Author;
  cards: PreviewCardDTO[];
}

export interface PreviewCardDTO {
  id: string;
  term: string;
  meaning: string;
}

export interface CreateDeckRequest {
  name: string;
  description: string;
  type: DeckType;
}

export interface UpdateDeckRequest {
  name: string;
  description: string;
}

export interface SearchDeckQuery {
  keyword?: string;
  type?: DeckType | "";
  page?: number;
  pageSize?: number;
}

// === Vocabulary Card ===
export interface VocabularyCardDTO {
  id: string;
  term: string;
  meaning: string;
  deckId: string;
  examples: ExampleSentenceDTO[];
}

export interface CreateVocabularyRequest {
  term: string;
  meaning: string;
  deckId: string;
  examples: CreateExampleSentenceRequest[];
}

export interface UpdateVocabularyCardRequest {
  term: string;
  meaning: string;
}

// === Grammar Card ===
export interface GrammarCardDTO {
  id: string;
  term: string;
  meaning: string;
  structure: string;
  explanation?: string;
  caution?: string;
  deckId?: string;
  examples: ExampleSentenceDTO[];
}

export interface CreateGrammarCardRequest {
  term: string;
  meaning: string;
  structure: string;
  explanation?: string;
  caution?: string;
  deckId: string;
  examples: CreateExampleSentenceRequest[];
}

export interface UpdateGrammarCardRequest {
  term: string;
  meaning: string;
  structure: string;
  explanation?: string;
  caution?: string;
}

// === Example Sentences ===
export interface ExampleSentenceDTO {
  id: string;
  clozeSentence: string;
  expectedAnswer: string;
  fullSentence: string;
  hint?: string;
}

export interface CreateExampleSentenceRequest {
  clozeSentence: string;
  expectedAnswer: string;
  hint?: string;
}

export interface CreateCardExampleRequest {
  clozeSentence: string;
  expectedAnswer: string;
  hint?: string;
  vocabularyCardId?: string;
  grammarCardId?: string;
}

export interface UpdateCardExampleRequest {
  clozeSentence: string;
  expectedAnswer: string;
  hint?: string;
}
