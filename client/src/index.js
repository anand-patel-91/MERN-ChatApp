import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { MessagesContextProvider } from "./contexts/MessagesContext";
import { AuthContextProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MessagesContextProvider>
        <App />
      </MessagesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
