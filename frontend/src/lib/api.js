import axios from "axios";
import { clearAuthSession, getAccessToken } from "./auth";

export const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const isPublicAuthRequest = (url = "") =>
  ["/api/login", "/api/register"].some((path) => url.includes(path));

const redirectToLogin = () => {
  clearAuthSession();
  if (typeof window !== "undefined") {
    if (window.location.pathname !== "/login") {
      window.history.replaceState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }
};

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error || {};

    if (!response || response.status !== 401 || !config) {
      return Promise.reject(error);
    }

    if (isPublicAuthRequest(config.url)) {
      return Promise.reject(error);
    }

    redirectToLogin();
    return Promise.reject(error);
  }
);

export const apiFetch = (path, options = {}) =>
  api({
    url: path,
    method: options.method || "GET",
    data: options.data,
  });

export const authenticatedFetch = (path, options = {}) =>
  api({
    url: path,
    method: options.method || "GET",
    data: options.data,
  });
