import { apiRoutes } from "@/utils/routes";
import useAPIMutation from "../useApiMutation";
import type { ApiResponse } from "@/utils/utils";

export type userLookupRequest = {
  userId: string;
  refreshToken: string;
};

export type UserLookupData = {
  userId: string;
  refreshToken: string;
  accessToken: string;
};

export type UserLookupResponse = ApiResponse<UserLookupData>;

const useUserLookup = () => {
  return useAPIMutation<userLookupRequest, UserLookupResponse>(
    apiRoutes.userLookup,
    {
      mutationKey: ["user-lookup"],
    },
  );
};

export default useUserLookup;
