import { createContext, useReducer } from "react";

export const MessagesContext = createContext();

export const messagesReducer = (state, action) => {
  switch (action.type) {
    case "SET_MESSAGES":
      return {
        messages: action.payload,
      };
    case "SEND_MESSAGE":
      return {
        messages: [...state.messages, action.payload],
      };
    case "APPEND_MESSAGES":
      return {
        messages: [
          ...state.messages,
          ...action.payload.filter(
            (message) => !state.messages.some((item) => item._id === message._id)
          ),
        ],
      };
    case "LOGOUT":
      return {
        messages: null,
      };
    default:
      return state;
  }
};

export const MessagesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messagesReducer, {
    messages: null,
  });

  return (
    <MessagesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MessagesContext.Provider>
  );
};
