import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, CategoryRequest } from "./categoriesApi";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryRequest) =>
      categoriesApi.createCategory(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryRequest }) =>
      categoriesApi.updateCategory(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
  });
}
