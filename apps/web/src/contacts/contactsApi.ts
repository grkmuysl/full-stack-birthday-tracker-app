import { apiClient } from "@/api/axiosClient";
import type { PagedResponse, PersonRequest, PersonResponse } from "@/api/types";

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
      {
        params,
      },
    );
    return data;
  },

  createPerson: async (payload: PersonRequest): Promise<PersonResponse> => {
    const { data } = await apiClient.post<PersonResponse>("/people", payload);
    return data;
  },
  updatePerson: async (
    id: number,
    payload: PersonRequest,
  ): Promise<PersonResponse> => {
    const { data } = await apiClient.put<PersonResponse>(
      `/people/${id}`,
      payload,
    );
    return data;
  },
  deletePerson: async (id: number): Promise<void> => {
    await apiClient.delete(`/people/${id}`);
  },
};
