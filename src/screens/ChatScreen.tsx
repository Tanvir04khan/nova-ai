import { useEffect, useRef, useState } from "react";

import { SendIcon, StopCircleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Welcome from "@/components/welcome";
import Message from "@/components/message";
import { useNavigate, useParams } from "react-router";
import useCreateConversation from "@/hooks/conversation/useCreateConversation";
import { useUserDetailsState } from "@/store/useUserDetails";
import { useToast } from "@/components/ui/toast";
import { appRoutes } from "@/utils/routes";
import useMessages from "@/hooks/conversation/useMessages";
import useCreateMessage from "@/hooks/conversation/useCreateMessage";
import { getResponseFromAI } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";

export type ChatMessage = {
  messageId: string;
  role: string;
  content: string;
};

const ChatScreen = () => {
  const [messagesState, setMessagesState] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<any>(null);
  const abortRef = useRef<AbortController>(null);

  const toast = useToast();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { conversationId } = useParams<{ conversationId: string }>();

  const userDetails = useUserDetailsState((state) => state.userDetails);

  const { data: messages, isFetching: isLoadingMessages } = useMessages({
    conversationId: conversationId ?? "",
    userId: userDetails?.userId ?? "",
  });

  const { mutate: createNewMessage, isPending: isCreatingNewChat } =
    useCreateMessage();

  const { mutate: createConversation, isPending: isCreatingConversation } =
    useCreateConversation();

  const handleSend = () => {
    if (!conversationId || conversationId === "new-chat") {
      createConversation(
        {
          userId: userDetails?.userId ?? "",
          message: input,
        },
        {
          onError: (res) => {
            toast({
              message: res.message,
              variant: "error",
            });
          },
          onSuccess: (res) => {
            queryClient.invalidateQueries({
              queryKey: ["user-conversation", userDetails?.userId],
            });

            navigate(
              appRoutes.Chat.replace(
                ":conversationId",
                res.data.conversationId,
              ),
            );
          },
        },
      );
      return;
    }

    handleNewChat("user");
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const handleKey = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = (role: string) => {
    setMessagesState((prev) => [
      ...prev,
      { messageId: String(prev.length), content: input, role },
    ]);

    createNewMessage(
      {
        conversationId: conversationId ?? "",
        userId: userDetails?.userId ?? "",
        message: input,
      },
      {
        onError: (res) => {
          console.log(res.message);
        },
      },
    );

    getResponseFromAI(
      input,
      userDetails?.userId ?? "",
      conversationId ?? "",
      setMessagesState,
      setStreaming,
    );

    setInput("");
  };

  useEffect(() => {
    setMessagesState(
      messages?.data?.messages.map(({ messageId, role, content }) => ({
        messageId,
        content,
        role,
      })) ?? [],
    );
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesState]);

  useEffect(() => {
    if (messagesState.length === 1) {
      getResponseFromAI(
        messagesState[0].content,
        userDetails?.userId ?? "",
        conversationId ?? "",
        setMessagesState,
        setStreaming,
      );
    }
  }, [messagesState]);

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Main */}
      <main className="flex flex-col flex-1 min-w-0">
        <div className="flex-1 overflow-y-auto">
          {messagesState.length === 0 ? (
            <Welcome fromTool={false} />
          ) : (
            <div className="max-w-3xl mx-auto w-full pb-4">
              {messagesState.map((m, i) => (
                <Message
                  key={m.messageId}
                  msg={m}
                  isStreaming={
                    streaming &&
                    i === messagesState.length - 1 &&
                    m.role === "assistant"
                  }
                />
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
                disabled={streaming}
              />
              {streaming || isCreatingConversation ? (
                <button
                  onClick={handleStop}
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

export default ChatScreen;
