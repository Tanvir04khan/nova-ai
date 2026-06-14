import type { ChatMessage } from "@/screens/ChatScreen";
import { apiRoutes } from "./routes";

export type ApiResponse<T = null> = {
  status: string;
  statusCode: number;
  message: string;
  data: T;
};

const baseURL = import.meta.env.VITE_API_URL;

export const getAPIUrl = (url: string) => `${baseURL}/api/v1${url}`;

export const saveAccessTokenAndRefreshToken = (
  accessToken: string,
  refreshToken: string,
  userId: string,
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("authUserId", userId);
  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
  document.cookie = `auth-refreshToken=${refreshToken}; expires=${expires.toUTCString()}; path=/`;
};

export type AIAnswerRequest = {
  userId: string;
  conversationId: string;
  message: string;
  service: "gemini";
  // model
};

export const getResponseFromAI = async (
  message: string,
  userId: string,
  conversationId: string,
  setState: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setStreaming: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setStreaming(true);

    const request: AIAnswerRequest = {
      conversationId: conversationId,
      message,
      service: "gemini",
      userId: userId,
    };

    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(getAPIUrl(apiRoutes.chat), {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is empty");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, {
        stream: true,
      });

      result += chunk;

      setState((prev) => {
        const copy = [...prev];

        const lastMessage = copy[copy.length - 1];

        if (lastMessage?.role === "user") {
          copy.push({
            messageId: crypto.randomUUID(),
            content: result,
            role: "model",
          });

          return copy;
        }

        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: result,
        };

        return copy;
      });
    }
  } catch (error) {
    console.error("Streaming error:", error);
  } finally {
    setStreaming(false);
  }
};
