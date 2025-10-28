import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePrefetch<T>(
  queryKey: (string | number | object)[],
  queryFn: () => Promise<T>
) {
  const queryClient = useQueryClient();

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient, queryKey, queryFn]);

  return prefetch;
}
