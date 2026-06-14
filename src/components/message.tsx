import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bot, TextCursor } from "lucide-react";
import ReactMarkdown from "react-markdown";

const Message = ({
  msg,
  isStreaming,
}: {
  msg: { role: string; content: string };
  isStreaming: boolean;
}) => {
  const isUser = msg.role === "user";
  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-5",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {isUser ? (
        <Avatar>
          <AvatarImage src={msg.role} alt={msg.role} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar>
          <AvatarFallback>
            <Bot />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] flex flex-col gap-1",
          isUser ? "items-end" : "items-start",
        )}
      >
        <span className="text-xs text-gray-400 font-medium">
          {isUser ? "You" : "NovaBot"}
        </span>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-[#171717] text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-800 rounded-tl-sm",
          )}
        >
          <ReactMarkdown>{msg.content}</ReactMarkdown>
          {isStreaming && <TextCursor />}
        </div>
      </div>
    </div>
  );
};

export default Message;
