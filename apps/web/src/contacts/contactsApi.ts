import { apiClient } from "@/api/axiosClient";
import type { PagedResponse, PersonResponse } from "@/api/types";

export interface GetPeopleParams {
  category?: string;
  upcomingDays?: number;
  page?: number;
}

export const contactsApi = {
  getPeople: async (
    params: GetPeopleParams = {},
  ): Promise<PagedResponse<PersonResponse>> => {
    const { data } = await apiClient.get<PagedResponse<PersonResponse>>(
      "/people",
      {
        params,
      },
    );
    return data;
  },
};
