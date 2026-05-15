import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const url = config.url || "";
  let token = localStorage.getItem("adminToken");

  if (url.startsWith("/donor")) {
    token = localStorage.getItem("donorToken");
  }

  if (url.startsWith("/recipient")) {
    token = localStorage.getItem("recipientToken");
  }

  if (
    url.startsWith("/admin") ||
    url.startsWith("/match") ||
    (config.method === "patch" && url.startsWith("/donor/status")) ||
    (config.method === "patch" && url.startsWith("/recipient/status"))
  ) {
    token = localStorage.getItem("adminToken");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
