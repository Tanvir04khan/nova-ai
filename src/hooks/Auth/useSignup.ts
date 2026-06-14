import { apiRoutes } from "@/utils/routes";
import useAPIMutation from "../useApiMutation";
import type { ApiResponse } from "@/utils/utils";

export type SignupRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export type SignupData = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export type SignupResponse = ApiResponse<SignupData>;

const useSignup = () => {
  return useAPIMutation<SignupRequest, SignupResponse>(apiRoutes.signup, {
    mutationKey: ["user-signup"],
  });
};

export default useSignup;
