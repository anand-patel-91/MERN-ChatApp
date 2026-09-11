import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { API_URL } from "../config";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(json.error || "Unable to log in");
        return;
      }

      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
    } catch (requestError) {
      setError("Unable to connect to the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
