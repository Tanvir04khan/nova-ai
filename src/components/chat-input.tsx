import { useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAPIUrl } from "@/utils/utils";
import { apiRoutes } from "@/utils/routes";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    const value = message.trim();
    if (!value) return;

    const response = await fetch(getAPIUrl(apiRoutes.chat), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: value, service: "gemini" }),
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      fullText += decoder.decode(chunk, { stream: true });
    }

    fullText += decoder.decode(); // flush remaining bytes

    console.log(fullText);
    onSend(fullText);
    setMessage("");
  };

  return (
    <div className="w-full border-t bg-background">
      <div className="w-full p-4">
        <div className="relative w-full">
          <Textarea
            value={message}
            placeholder="Message Nova AI..."
            rows={1}
            className="w-full resize-none pr-14 min-h-[56px]"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <Button
            size="icon"
            className="absolute bottom-2 right-2"
            onClick={handleSend}
          >
            <SendHorizontal />
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
