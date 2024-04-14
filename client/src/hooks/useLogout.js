import { useAuthContext } from "./useAuthContext";
import { useChatContext } from "./useChatContext";
import { useMessagesContext } from "./useMessagesContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: chatDispatch } = useChatContext();
  const {dispatch: messagesDispatch} = useMessagesContext()

  const logout = () => {
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
    chatDispatch({ type: "LOGOUT" });
    messagesDispatch({ type: "LOGOUT" });
  };

  return { logout };
};
