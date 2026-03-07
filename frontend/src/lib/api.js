import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from "./auth";

export const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const buildUrl = (path) =>
  path.startsWith("http") ? path : `${apiBaseUrl}${path}`;

const withJsonHeaders = (headers = {}) => ({
  "Content-Type": "application/json",
  ...headers,
});

export const apiFetch = (path, options = {}) =>
  fetch(buildUrl(path), {
    ...options,
    headers: withJsonHeaders(options.headers),
  });

const requestNewAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    return null;
  }

  const response = await apiFetch("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.accessToken) {
    clearAuthSession();
    return null;
  }

  updateAccessToken(result.accessToken);
  return result.accessToken;
};

export const authenticatedFetch = async (path, options = {}) => {
  const accessToken = getAccessToken();
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...withJsonHeaders(options.headers),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (response.status !== 401) {
    return response;
  }

  const newAccessToken = await requestNewAccessToken();

  if (!newAccessToken) {
    return response;
  }

  return fetch(buildUrl(path), {
    ...options,
    headers: {
      ...withJsonHeaders(options.headers),
      Authorization: `Bearer ${newAccessToken}`,
    },
  });
};
