import ToastProvider from "@/components/ui/toast";
import React, { useEffect } from "react";
import SidebarProvider from "./SidebarProvider";
import AuthProvider from "./AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { appRoutes } from "@/utils/routes";

const AppProviders = ({
  children,
  showSidebar,
}: {
  children: React.ReactNode;
  showSidebar: boolean;
}) => {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/") {
      navigate(appRoutes.Auth);
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          {showSidebar ? (
            <SidebarProvider>{children}</SidebarProvider>
          ) : (
            children
          )}
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
