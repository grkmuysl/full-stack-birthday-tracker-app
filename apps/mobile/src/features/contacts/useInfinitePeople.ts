import { useInfiniteQuery } from "@tanstack/react-query";
import { contactsApi, GetPeopleParams } from "./contactsApi";

type Params = Omit<GetPeopleParams, "page">;

export function useInfinitePeople(params: Params = {}) {
  return useInfiniteQuery({
    queryKey: ["people", "infinite", params],
    queryFn: ({ pageParam }) =>
      contactsApi.getPeople({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.pageNumber + 1 >= lastPage.totalPages;
      return isLastPage ? undefined : lastPage.pageNumber + 1;
    },
  });
}
