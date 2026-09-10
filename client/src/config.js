const apiHost = window.location.hostname || "localhost";

export const API_URL =
  process.env.REACT_APP_API_URL || `http://${apiHost}:4000`;