import api from "./api";
import type { ApiResponse } from "@/types/api";
import type {
  ReviewSessionDTO,
  SubmitReviewRequest,
  ReviewResultDTO,
} from "@/types/learn";

/**
 * Review API service — handles review-related HTTP calls.
 */
export const reviewService = {
  getReviewSession(deckId: string) {
    return api.get<ApiResponse<ReviewSessionDTO>>(`/review/deck/${deckId}`);
  },

  submitReview(data: SubmitReviewRequest) {
    return api.post<ApiResponse<ReviewResultDTO>>("/review/submit", data);
  },
};
