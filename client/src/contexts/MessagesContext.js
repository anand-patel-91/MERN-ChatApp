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
          ...state.messages.map(
            (message) =>
              action.payload.find((item) => item._id === message._id) || message
          ),
          ...action.payload.filter(
            (message) => !state.messages.some((item) => item._id === message._id)
          ),
        ],
      };
    case "REMOVE_MESSAGES":
      return {
        messages: state.messages.filter(
          (message) => !action.payload.includes(message._id)
        ),
      };
    case "UPDATE_MESSAGE":
      return {
        messages: state.messages.map((message) =>
          message._id === action.payload._id ? action.payload : message
        ),
      };
    case "DELETE_MESSAGE":
      return {
        messages: state.messages.filter(
          (message) => message._id !== action.payload
        ),
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
