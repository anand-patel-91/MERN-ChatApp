import { useContext } from "react";
import { MessagesContext } from "../contexts/MessagesContext";

export const useMessagesContext = () => {
  const context = useContext(MessagesContext);

  if (!context) {
    throw Error("Not inside provider");
  }

  return context;
};
