import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authenticatedFetch } from "../lib/api";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  saveAuthSession,
  updateStoredUser,
} from "../lib/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setUser(null);
      setIsAuthLoading(false);
      return null;
    }

    try {
      const response = await authenticatedFetch("/api/auth/me");
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        clearAuthSession();
        setUser(null);
        return null;
      }

      setUser(result.user);
      updateStoredUser(result.user);
      return result.user;
    } catch {
      const storedUser = getStoredUser();
      setUser(storedUser);
      return storedUser;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, []);

  const login = useCallback((session) => {
    saveAuthSession(session);
    setUser(session.user || null);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthLoading,
      isAuthenticated: Boolean(user && getAccessToken()),
      login,
      logout,
      refreshUser,
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
