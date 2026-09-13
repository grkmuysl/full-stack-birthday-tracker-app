import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contactsApi } from "./contactsApi";
import { PersonRequest } from "@/api/types";

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PersonRequest) => contactsApi.createPerson(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["people"] }),
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PersonRequest }) =>
      contactsApi.updatePerson(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["people"] }),
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactsApi.deletePerson(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["people"] }),
  });
}
