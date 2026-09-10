const apiHost = window.location.hostname || "localhost";
const configuredApiUrl = process.env.REACT_APP_API_URL;

export const API_URL =
  (configuredApiUrl || `http://${apiHost}:4000`).replace(/\/+$/, "");