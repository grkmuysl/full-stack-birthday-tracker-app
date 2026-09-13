import { apiClient } from "@/api/axiosClient";
import { CategoryResponse } from "@/api/types";

export interface CategoryRequest {
  name: string;
  color: string;
}

export const categoriesApi = {
  getCategories: async (): Promise<CategoryResponse[]> => {
    const { data } = await apiClient.get<CategoryResponse[]>("/categories");
    return data;
  },
  createCategory: async (
    payload: CategoryRequest,
  ): Promise<CategoryResponse> => {
    const { data } = await apiClient.post<CategoryResponse>(
      "/categories",
      payload,
    );
    return data;
  },
  updateCategory: async (
    id: number,
    payload: CategoryRequest,
  ): Promise<CategoryResponse> => {
    const { data } = await apiClient.put<CategoryResponse>(
      `/categories/${id}`,
      payload,
    );
    return data;
  },
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
