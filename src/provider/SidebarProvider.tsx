import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider as SCNSidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useConversation from "@/hooks/conversation/useConversation";
import { useUserDetailsState } from "@/store/useUserDetails";
import type { ReactNode } from "react";
import { useParams } from "react-router";

export default function SidebarProvider({ children }: { children: ReactNode }) {
  const { conversationId } = useParams<{ conversationId: string }>();

  const user = useUserDetailsState((state) => state.userDetails);

  const { data: conversations } = useConversation(user?.userId ?? "");

  const headerText =
    conversations?.data.find((c) => c.conversationId === conversationId)
      ?.title ?? "";

  return (
    <SCNSidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 right-0 w-full z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-8"
            />
            {headerText && <span className="font-medium">{headerText}</span>}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SCNSidebarProvider>
  );
}
