import api from "./api";
import type { ApiResponse } from "@/types/api";
import type {
  DeckQueueDTO,
  AddToQueueRequest,
} from "@/types/learn";

/**
 * Deck Queue API service — handles learning queue HTTP calls.
 */
export const queueService = {
  getQueue() {
    return api.get<ApiResponse<DeckQueueDTO[]>>("/queue");
  },

  addToQueue(data: AddToQueueRequest) {
    return api.post<ApiResponse<boolean>>("/queue", data);
  },

  removeFromQueue(deckId: string) {
    return api.delete<ApiResponse<boolean>>(`/queue/${deckId}`);
  },
};
