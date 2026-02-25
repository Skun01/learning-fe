import api from "./api";
import type { ApiResponse } from "@/types/api";
import type {
  DeckSummaryDTO,
  DeckDTO,
  CreateDeckRequest,
  UpdateDeckRequest,
  SearchDeckQuery,
} from "@/types/deck";

/**
 * Deck API service — handles all deck-related HTTP calls.
 */
export const deckService = {
  getDecks(query: SearchDeckQuery = {}) {
    const params = new URLSearchParams();
    if (query.keyword) params.append("keyword", query.keyword);
    if (query.type) params.append("type", query.type);
    params.append("page", String(query.page ?? 1));
    params.append("pageSize", String(query.pageSize ?? 20));

    return api.get<ApiResponse<DeckSummaryDTO[]>>(`/decks?${params.toString()}`);
  },

  getDeck(id: string) {
    return api.get<ApiResponse<DeckDTO>>(`/decks/${id}`);
  },

  createDeck(data: CreateDeckRequest) {
    return api.post<ApiResponse<boolean>>("/decks", data);
  },

  updateDeck(id: string, data: UpdateDeckRequest) {
    return api.put<ApiResponse<boolean>>(`/decks/${id}`, data);
  },

  deleteDeck(id: string) {
    return api.delete<ApiResponse<boolean>>(`/decks/${id}`);
  },
};
