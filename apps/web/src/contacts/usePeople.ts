import { useQuery } from "@tanstack/react-query";
import { contactsApi, type GetPeopleParams } from "./contactsApi";

export function usePeople(params: GetPeopleParams = {}) {
  return useQuery({
    queryKey: ["people", params],
    queryFn: () => contactsApi.getPeople(params),
  });
}
