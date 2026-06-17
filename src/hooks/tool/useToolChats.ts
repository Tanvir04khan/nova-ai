import { apiRoutes } from "@/utils/routes";
import useAPIQuery from "../useApiQuery";
import type { ApiResponse } from "@/utils/utils";

export type ToolChat = {
  userId: string;
  message: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  modifiedBy: string;
  toolChatId: string;
  role: "user" | "model";
};

export type ToolChatResponse = ApiResponse<ToolChat[]>;

const useToolChats = (userId: string) => {
  return useAPIQuery<ToolChatResponse>(
    apiRoutes.ToolChat.replace(":userId", userId),
    {
      enabled: Boolean(userId),
      queryKey: ["get-tool-chats", userId],
      staleTime: 5 * 60 * 1000,
    },
  );
};

export default useToolChats;
