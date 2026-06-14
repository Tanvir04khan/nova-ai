import { useMutation, type MutationKey } from "@tanstack/react-query";
import type { ObjectMap } from "./useApiQuery";
import { getAPIUrl } from "@/utils/utils";

export type APIQueryOptions = {
  mutationKey: MutationKey;
  method?: "POST" | "DELETE" | "PUT" | "PATCH";
  params?: ObjectMap;
};

const useAPIMutation = <Request, Response>(
  url: string,
  options: APIQueryOptions,
) => {
  const { mutationKey, method, params } = options;

  let apiUrl = getAPIUrl(url);

  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString();

    apiUrl = `${apiUrl}?${queryString}`;
  }

  const accessToken = localStorage.getItem("accessToken");

  return useMutation<Response, Error, Request>({
    mutationFn: async (body: Request) => {
      try {
        const res = await fetch(apiUrl, {
          method: method ?? "POST",
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

        return parsedRes as Response;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    mutationKey,
  });
};

export default useAPIMutation;
