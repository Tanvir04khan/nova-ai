import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { appRoutes } from "@/utils/routes";
import useConversation from "@/hooks/conversation/useConversation";
import { useUserDetailsState } from "@/store/useUserDetails";

const mockChats = [
  {
    conversationId: "1",
    title: "Project kickoff chat",
    createdAt: "2026-06-13",
  },
  {
    conversationId: "2",
    title: "Design review notes",
    createdAt: "2026-06-11",
  },
  {
    conversationId: "3",
    title: "Marketing copy ideas",
    createdAt: "2026-06-09",
  },
];

export function NavMain() {
  const userDetails = useUserDetailsState((state) => state.userDetails);

  const { data: conversations, isFetching: isLoadingConversations } =
    useConversation(userDetails?.userId ?? "");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link to={appRoutes.NewChat} />}
            className="font-semibold"
          >
            <PlusIcon />
            <span>New chat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {conversations?.data.map((chat) => (
          <SidebarMenuItem key={chat.conversationId}>
            <SidebarMenuButton
              render={
                <Link
                  to={appRoutes.Chat.replace(
                    ":conversationId",
                    chat.conversationId,
                  )}
                />
              }
            >
              <span className="text-left">{chat.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
