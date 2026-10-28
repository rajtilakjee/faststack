"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchCurrentUserClient,
  logoutClient,
  type UserPublic,
} from "@/lib/auth";

type AuthContextValue = {
  user: UserPublic | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  setUser: (user: UserPublic | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  initialUser: UserPublic | null;
};

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<UserPublic | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextUser = await fetchCurrentUserClient();
      setUser(nextUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutClient();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      refreshUser,
      setUser,
      logout,
    }),
    [user, loading, error, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
