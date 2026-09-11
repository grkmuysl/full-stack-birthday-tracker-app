import { useQuery } from "@tanstack/react-query";
import { contactsApi, GetPeopleParams } from "./contactsApi";

export function usePeople(params: GetPeopleParams = {}) {
  return useQuery({
    queryKey: ["people", params],
    queryFn: () => contactsApi.getPeople(params),
  });
}
