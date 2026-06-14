import { useToast } from "@/components/ui/toast";
import useUserLookup from "@/hooks/Auth/useUserLookup";
import useUser from "@/hooks/user/useUser";
import { useUserDetailsState } from "@/store/useUserDetails";
import { appRoutes } from "@/utils/routes";
import { saveAccessTokenAndRefreshToken } from "@/utils/utils";
import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { mutate: userLookup, data: loginData } = useUserLookup();

  const { data: userDetails } = useUser(loginData?.data?.userId ?? "");

  const updateUserDetails = useUserDetailsState(
    (state) => state.updateUserDetails,
  );

  const toast = useToast();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("authUserId") ?? "";
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith("auth-refreshToken="));
    const refreshToken = cookie ? cookie.split("=")[1] : "";

    userLookup(
      { userId, refreshToken },
      {
        onError: (res) => {
          toast({
            message: res.message,
            variant: "error",
          });

          navigate(appRoutes.Auth);
        },

        onSuccess: (res) => {
          if (
            !res.data.accessToken ||
            !res.data.refreshToken ||
            !res.data.userId
          ) {
            return toast({
              message: "Something went wrong, try logging in after some time.",
              variant: "error",
            });
          }

          toast({
            message: res.message,
            variant: "success",
          });

          saveAccessTokenAndRefreshToken(
            res.data.accessToken,
            res.data.refreshToken,
            res.data.userId,
          );

          if (pathname === appRoutes.Auth || pathname === appRoutes.Signup) {
            navigate(appRoutes.NewChat);
          }
        },
      },
    );
  }, [location]);

  useEffect(() => {
    if (userDetails) {
      updateUserDetails({
        userId: userDetails.data.userId,
        email: userDetails.data.email,
        firstName: userDetails.data.firstName,
        lastName: userDetails.data.lasteName,
        phoneNumber: userDetails.data.phoneNumber,
      });
    }
  }, [userDetails]);

  return <>{children}</>;
};

export default AuthProvider;
