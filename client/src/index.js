import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { MessagesContextProvider } from "./contexts/MessagesContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import { ChatContextProvider } from "./contexts/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <MessagesContextProvider>
          <App />
        </MessagesContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
