import { getAPIUrl } from "@/utils/utils";
import { useQuery, type QueryKey } from "@tanstack/react-query";

export type ObjectMap = { [key: string]: any };

export type APIQueryOptions = {
  body?: ObjectMap;
  enabled?: boolean;
  method?: "GET" | "POST";
  params?: ObjectMap;
  queryKey: QueryKey;
  staleTime?: number;
};

const useAPIQuery = <T>(url: string, options: APIQueryOptions) => {
  const { queryKey, body, enabled, method, params, staleTime } = options;

  let apiUrl = getAPIUrl(url);

  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString();

    apiUrl = `${apiUrl}?${queryString}`;
  }

  const accessToken = localStorage.getItem("accessToken");

  return useQuery<T>({
    enabled,
    queryFn: async () => {
      try {
        const res = await fetch(apiUrl, {
          method: method ?? "GET",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res) {
          throw new Error("No data returned from API.");
        }

        const parsedRes = await res.json();

        return parsedRes as T;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    queryKey,
    staleTime,
  });
};

export default useAPIQuery;
