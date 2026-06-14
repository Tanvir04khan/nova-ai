import { apiRoutes } from "@/utils/routes";
import useAPIMutation from "../useApiMutation";
import type { ApiResponse } from "@/utils/utils";

export type CreateConversationRequest = {
  userId: string;
  message: string;
};

export type CreateConversationResponse = ApiResponse<{
  conversationId: string;
  messageId: string;
}>;

const useCreateConversation = () => {
  return useAPIMutation<CreateConversationRequest, CreateConversationResponse>(
    apiRoutes.CreateConversation,
    {
      mutationKey: ["create-conversation"],
    },
  );
};

export default useCreateConversation;
