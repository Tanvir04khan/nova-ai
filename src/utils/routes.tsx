import AuthScreen from "@/screens/AuthScreen";
import ChatScreen from "@/screens/ChatScreen";
import SignupScreen from "@/screens/SignupScreen";

export const appRoutes = {
  Auth: "/auth",
  Signup: "/signup",
  NewChat: "/chat/new-chat",
  Chat: "/chat/:conversationId",
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
};

export const AppRoutes = [
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
];
