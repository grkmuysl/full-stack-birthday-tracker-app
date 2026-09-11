import { apiClient } from "@/api/axiosClient";
import { CategoryResponse } from "@/api/types";

export const categoriesApi = {
  getCategories: async (): Promise<CategoryResponse[]> => {
    const { data } = await apiClient.get<CategoryResponse[]>("/categories");
    return data;
  },
};
