import api from "./api";
import type { ApiResponse } from "@/types/api";
import type {
  LearnBatchDTO,
  MarkCardRequest,
  DailyProgressDTO,
  DeckProgressDTO,
} from "@/types/learn";

/**
 * Learn API service — handles learning-related HTTP calls.
 */
export const learnService = {
  getLearnBatch(deckId: string) {
    return api.get<ApiResponse<LearnBatchDTO>>(`/learn/deck/${deckId}`);
  },

  markCardLearned(data: MarkCardRequest) {
    return api.post<ApiResponse<boolean>>("/learn/mark", data);
  },

  getDailyProgress() {
    return api.get<ApiResponse<DailyProgressDTO>>("/learn/progress");
  },

  getDeckProgress(deckId: string) {
    return api.get<ApiResponse<DeckProgressDTO>>(`/learn/deck/${deckId}/stats`);
  },
};
