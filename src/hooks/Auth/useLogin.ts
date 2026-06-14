import { apiRoutes } from "@/utils/routes";
import useAPIMutation from "../useApiMutation";
import type { ApiResponse } from "@/utils/utils";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginData = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = ApiResponse<LoginData>;

const useLogin = () => {
  return useAPIMutation<LoginRequest, LoginResponse>(apiRoutes.login, {
    mutationKey: ["user-login"],
  });
};

export default useLogin;
