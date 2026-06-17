import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PlusIcon, Wrench } from "lucide-react";
import { Link } from "react-router";
import { appRoutes } from "@/utils/routes";
import useConversation from "@/hooks/conversation/useConversation";
import { useUserDetailsState } from "@/store/useUserDetails";

export function NavMain() {
  const userDetails = useUserDetailsState((state) => state.userDetails);

  const { data: conversations, isFetching: isLoadingConversations } =
    useConversation(userDetails?.userId ?? "");

  return (
    <SidebarGroup>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="flex items-center gap-2"
          render={<Link to={appRoutes.Tool} />}
        >
          <Wrench /> <span className="text-left">Tools</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
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
