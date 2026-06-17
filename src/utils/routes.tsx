import AuthScreen from "@/screens/AuthScreen";
import ChatScreen from "@/screens/ChatScreen";
import SignupScreen from "@/screens/SignupScreen";
import Tool from "@/screens/Tools";
import { Navigate } from "react-router";

export const appRoutes = {
  NoRoute: "/",
  Auth: "/auth",
  Signup: "/signup",
  NewChat: "/chat/new-chat",
  Chat: "/chat/:conversationId",
  Tool: "/tools",
};

export const apiRoutes = {
  login: "/login",
  signup: "/signup",
  userLookup: "/user-lookup",
  getUser: "/user/:userId",
  chat: "/chat",
  Conversation: "/conversation/:userId",
  CreateConversation: "/create-conversation",
  GetMessages: "/messages/:userId",
  CreateMessage: "/create-messages",
  GoogleAuth: "/auth/google",
  ToolChat: "/tool-chat/:userId",
  Tools: "/tools",
};

export const AppRoutes = [
  {
    path: appRoutes.NoRoute,
    element: () => <Navigate to={appRoutes.Auth} replace />,
  },
  {
    path: appRoutes.Auth,
    element: AuthScreen,
  },
  {
    path: appRoutes.Signup,
    element: SignupScreen,
  },
  {
    path: appRoutes.NewChat,
    element: ChatScreen,
    showSidebar: true,
  },
  {
    path: appRoutes.Chat,
    element: ChatScreen,
    showSidebar: true,
  },
  {
    path: appRoutes.Tool,
    element: Tool,
    showSidebar: true,
  },
];
