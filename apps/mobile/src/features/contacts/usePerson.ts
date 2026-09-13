import { useQuery } from "@tanstack/react-query";
import { contactsApi } from "./contactsApi";

export function usePerson(id: number) {
  return useQuery({
    queryKey: ["people", id],
    queryFn: () => contactsApi.getPersonById(id),
    enabled: !!id,
  });
}
