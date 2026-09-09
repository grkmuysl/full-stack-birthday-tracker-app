import { apiClient } from "@/api/axiosClient";
import type { LoginRequest, RegisterRequest, TokenResponse } from "./types";

export const authApi = {
  login: async (payload: LoginRequest): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>(
      "/auth/login",
      payload,
    );
    return data;
  },
  register: async (payload: RegisterRequest): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },
};
