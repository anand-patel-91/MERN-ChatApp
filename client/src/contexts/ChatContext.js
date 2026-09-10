import { createContext, useReducer } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          chat: action.payload,
          searchVersion: state.searchVersion + 1,
          chatId:
            user._id < action.payload._id
              ? user._id + action.payload._id
              : action.payload._id + user._id,
        };
      case "UPDATE_CHAT_USER":
        return {
          ...state,
          chat: { ...state.chat, ...action.payload },
        };
      case "CLEAR_SEARCH":
        return {
          ...state,
          searchVersion: state.searchVersion + 1,
        };
      case "LOGOUT":
        return {
          chatId: null,
          chat: {},
          searchVersion: state.searchVersion + 1,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, {
    chatId: null,
    chat: {},
    searchVersion: 0,
  });

  return (
    <ChatContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
