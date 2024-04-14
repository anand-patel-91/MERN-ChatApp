import { createContext, useReducer } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            user.email < action.payload.email
              ? user.email + action.payload.email
              : action.payload.email + user.email,
        };
      case "LOGOUT":
        return {
          chatId: null,
          chat: {},
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, {
    chatId: null,
    chat: {},
  });

  return (
    <ChatContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
