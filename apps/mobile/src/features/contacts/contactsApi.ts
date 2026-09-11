import { apiClient } from "@/api/axiosClient";
import { PagedResponse, PersonResponse } from "@/api/types";

export interface GetPeopleParams {
  category?: number;
  upcomingDays?: number;
  page?: number;
}

export const contactsApi = {
  getPeople: async (
    params: GetPeopleParams = {},
  ): Promise<PagedResponse<PersonResponse>> => {
    const { data } = await apiClient.get<PagedResponse<PersonResponse>>(
      "/people",
      { params },
    );
    return data;
  },
  getPersonById: async (id: number): Promise<PersonResponse> => {
    const { data } = await apiClient.get<PersonResponse>(`/people/${id}`);
    return data;
  },
};
