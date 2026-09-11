import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { API_URL } from "../config";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, name, password, profilePic) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, name, password, profilePic }),
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(json.error || "Unable to create your account");
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

  return { signup, loading, error };
};
