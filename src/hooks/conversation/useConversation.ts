import type { ApiResponse } from "@/utils/utils";
import useAPIQuery from "../useApiQuery";
import { apiRoutes } from "@/utils/routes";

export type Conversation = {
  userId: string;
  createdAt: Date;
  conversationId: string;
  title: string;
};

export type ConversationResponse = ApiResponse<Conversation[]>;

const useConversation = (userId: string) => {
  return useAPIQuery<ConversationResponse>(
    apiRoutes.Conversation.replace(":userId", userId),
    {
      enabled: Boolean(userId),
      queryKey: ["user-conversation", userId],
      staleTime: 5 * 60 * 1000,
    },
  );
};

export default useConversation;
