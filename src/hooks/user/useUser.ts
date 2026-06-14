import { apiRoutes } from "@/utils/routes";
import useAPIQuery from "../useApiQuery";
import type { ApiResponse } from "@/utils/utils";

export type User = {
  userId: string;
  firstName: string;
  lasteName: string;
  email: string;
  phoneNumber: string;
};

export type UserResponse = ApiResponse<User>;

const useUser = (userId: string) => {
  return useAPIQuery<UserResponse>(
    apiRoutes.getUser.replace(":userId", userId),
    {
      enabled: Boolean(userId),
      queryKey: ["get-user", userId],
      staleTime: 5 * 60 * 1000, // 5mins
    },
  );
};

export default useUser;
