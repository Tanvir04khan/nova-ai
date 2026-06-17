import ToastProvider from "@/components/ui/toast";
import React from "react";
import SidebarProvider from "./SidebarProvider";
import AuthProvider from "./AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppProviders = ({
  children,
  showSidebar,
}: {
  children: React.ReactNode;
  showSidebar: boolean;
}) => {
  const queryClient = new QueryClient();

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
