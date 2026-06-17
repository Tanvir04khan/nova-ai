import { useRef, useState } from "react";

import { SendIcon, StopCircleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Welcome from "@/components/welcome";
import Message from "@/components/message";
import useToolChats from "@/hooks/tool/useToolChats";
import { useUserDetailsState } from "@/store/useUserDetails";
import useTool from "@/hooks/tool/useTool";
import { useToast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";

export type ChatMessage = {
  messageId: string;
  role: string;
  content: string;
};

const Tool = () => {
  const [input, setInput] = useState("");
  const bottomRef = useRef<any>(null);

  const toast = useToast();

  const queryClient = useQueryClient();

  const user = useUserDetailsState((state) => state.userDetails);

  const { data: toolChats, isFetching: isLoadingToolChats } = useToolChats(
    user?.userId ?? "",
  );

  const { mutate: useNovaTool, isPending: isUsingTool } = useTool();

  const handleSend = () => {
    useNovaTool(
      {
        message: input,
        userId: user?.userId ?? "",
      },
      {
        onError: (res) => {
          toast({
            message: res.message,
            variant: "error",
          });
        },
        onSuccess: (res) => {
          setInput("");
          queryClient.invalidateQueries({
            queryKey: ["get-tool-chats", user?.userId],
          });
        },
      },
    );
  };

  const handleKey = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messages: ChatMessage[] =
    toolChats?.data.map(({ toolChatId, message, role }) => ({
      content: message,
      role,
      messageId: toolChatId,
    })) ?? [];

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Main */}
      <main className="flex flex-col flex-1 min-w-0">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <Welcome fromTool={true} />
          ) : (
            <div className="max-w-3xl mx-auto w-full pb-4">
              {messages.map((m, i) => (
                <Message key={m.messageId} msg={m} isStreaming={false} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="sticky z-10 right-0 top-0 shrink-0 px-4 py-4 border-t border-gray-100 bg-white ">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-white rounded-2xl border border-gray-200 shadow-sm px-3 py-2 focus-within:border-gray-300 focus-within:shadow-md transition-all">
              <Textarea
                rows={1}
                placeholder="Message ChatGPT"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 min-h-[36px] max-h-40"
                style={{ resize: "none" }}
                disabled={isUsingTool}
              />
              {isUsingTool ? (
                <button
                  onClick={() => {}}
                  className="shrink-0 rounded-lg h-8 w-8 bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-all"
                >
                  <StopCircleIcon />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "shrink-0 rounded-lg h-8 w-8 flex items-center justify-center text-white transition-all",
                    input.trim()
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-200 cursor-not-allowed",
                  )}
                >
                  <SendIcon />
                </button>
              )}
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tool;
