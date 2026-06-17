import { apiRoutes } from "@/utils/routes";
import useAPIMutation from "../useApiMutation";
import type { ApiResponse } from "@/utils/utils";

export type ToolRequest = {
  userId: string;
  message: string;
};

export type ToolResponse = ApiResponse<{
  aiResponse: string;
}>;

const useTool = () => {
  return useAPIMutation<ToolRequest, ToolResponse>(apiRoutes.Tools, {
    mutationKey: ["tools"],
  });
};

export default useTool;
