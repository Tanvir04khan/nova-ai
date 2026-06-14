import { apiRoutes } from "@/utils/routes";
import useAPIMutation from "../useApiMutation";
import type { ApiResponse } from "@/utils/utils";

export type CreateMessageRequest = {
  userId: string;
  conversationId: string;
  message: string;
};

export type CreateMessageResponse = ApiResponse<{
  messageId: string;
}>;

const useCreateMessage = () => {
  return useAPIMutation<CreateMessageRequest, CreateMessageResponse>(
    apiRoutes.CreateMessage,
    {
      mutationKey: ["create-message"],
    },
  );
};

export default useCreateMessage;
