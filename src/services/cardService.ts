import api from "./api";
import type { ApiResponse } from "@/types/api";
import type {
  VocabularyCardDTO,
  CreateVocabularyRequest,
  UpdateVocabularyCardRequest,
  GrammarCardDTO,
  CreateGrammarCardRequest,
  UpdateGrammarCardRequest,
  CreateCardExampleRequest,
  UpdateCardExampleRequest,
} from "@/types/deck";

/**
 * Card API service — Vocabulary Cards, Grammar Cards, and Examples.
 */
export const cardService = {
  // === Vocabulary Cards ===
  getVocabularyCards(deckId: string) {
    return api.get<ApiResponse<VocabularyCardDTO[]>>(
      `/vocabularies/deck/${deckId}`
    );
  },

  getVocabularyCard(id: string) {
    return api.get<ApiResponse<VocabularyCardDTO>>(`/vocabularies/${id}`);
  },

  createVocabularyCard(data: CreateVocabularyRequest) {
    return api.post<ApiResponse<boolean>>("/vocabularies", data);
  },

  updateVocabularyCard(id: string, data: UpdateVocabularyCardRequest) {
    return api.put<ApiResponse<boolean>>(`/vocabularies/${id}`, data);
  },

  deleteVocabularyCard(id: string) {
    return api.delete<ApiResponse<boolean>>(`/vocabularies/${id}`);
  },

  // === Grammar Cards ===
  getGrammarCards(deckId: string) {
    return api.get<ApiResponse<GrammarCardDTO[]>>(
      `/grammars/deck/${deckId}`
    );
  },

  getGrammarCard(id: string) {
    return api.get<ApiResponse<GrammarCardDTO>>(`/grammars/${id}`);
  },

  createGrammarCard(data: CreateGrammarCardRequest) {
    return api.post<ApiResponse<boolean>>("/grammars", data);
  },

  updateGrammarCard(id: string, data: UpdateGrammarCardRequest) {
    return api.put<ApiResponse<boolean>>(`/grammars/${id}`, data);
  },

  deleteGrammarCard(id: string) {
    return api.delete<ApiResponse<boolean>>(`/grammars/${id}`);
  },

  // === Example Sentences ===
  createExample(data: CreateCardExampleRequest) {
    return api.post<ApiResponse<boolean>>("/examples", data);
  },

  updateExample(id: string, data: UpdateCardExampleRequest) {
    return api.put<ApiResponse<boolean>>(`/examples/${id}`, data);
  },

  deleteExample(id: string) {
    return api.delete<ApiResponse<boolean>>(`/examples/${id}`);
  },
};
