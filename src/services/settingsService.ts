import api from "./api";
import type { ApiResponse } from "@/types/api";
import type { UserSettingsDTO, UpdateUserSettingsRequest } from "@/types/learn";

/**
 * UserSettings API service — handles settings HTTP calls.
 */
export const settingsService = {
  getSettings() {
    return api.get<ApiResponse<UserSettingsDTO>>("/settings");
  },

  updateSettings(data: UpdateUserSettingsRequest) {
    return api.put<ApiResponse<boolean>>("/settings", data);
  },
};
