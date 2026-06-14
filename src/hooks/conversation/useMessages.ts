import type { ApiResponse } from "@/utils/utils";
import { apiRoutes } from "@/utils/routes";
import useAPIQuery from "../useApiQuery";

type MessageRequest = {
  conversationId: string;
  userId: string;
};

export type Message = {
  createdAt: Date;
  conversationId: string;
  messageId: string;
  role: "user" | "model";
  content: string;
};

type CMessages =
  | {
      createdAt: Date;
      conversationId: string;
      title: string;
      messages: Message[];
    }
  | undefined;

export type MessageResponse = ApiResponse<CMessages>;

const useMessages = (request: MessageRequest) => {
  return useAPIQuery<MessageResponse>(
    apiRoutes.GetMessages.replace(":userId", request.userId),
    {
      enabled: Boolean(request.conversationId) && Boolean(request.userId),
      queryKey: ["get-messages", ...Object.values(request)],
      staleTime: 5 * 1000 * 60,
      method: "POST",
      body: {
        conversationId: request.conversationId,
      },
    },
  );
};

export default useMessages;
