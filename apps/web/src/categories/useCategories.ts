import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "./categoriesApi";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getCategories,
  });
}
