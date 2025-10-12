import axios from "axios";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://attendance-academics-monitor-backend.onrender.com"
    : "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}