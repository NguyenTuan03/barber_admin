"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthStatusEnum } from "@/enum/AppEnum";
import { AuthUser } from "@/types/auth";
import { loginAdmin, UNAUTHORIZED_EVENT } from "@/services/adminApi";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  authStatus: AuthStatusEnum;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  authStatus: AuthStatusEnum.LOADING,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // IMPORTANT: initial state must be identical on the server and on the client's
  // first render, otherwise React throws a hydration mismatch. `localStorage` is
  // only available in the browser, so we always start at LOADING and hydrate the
  // real auth state from localStorage inside a useEffect (client-only, post-mount).
  const [authState, setAuthState] = useState<{
    token: string | null;
    user: AuthUser | null;
    status: AuthStatusEnum;
  }>({
    token: null,
    user: null,
    status: AuthStatusEnum.LOADING,
  });

  // Intentional one-time sync from localStorage (a browser-only external system)
  // right after mount, to avoid the SSR/client hydration mismatch that reading it
  // during render would cause. Each setAuthState call below is deliberate.
  useEffect(() => {
    const storedToken = localStorage.getItem("barber_admin_token");
    const storedUser = localStorage.getItem("barber_admin_user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuthState({
          token: storedToken,
          user: parsedUser,
          status: AuthStatusEnum.AUTHENTICATED,
        });
        return;
      } catch {
        localStorage.removeItem("barber_admin_token");
        localStorage.removeItem("barber_admin_user");
      }
    } else if (storedToken) {
      setAuthState({
        token: storedToken,
        user: { id: 1, email: "admin@t99barber.com", name: "Admin T99" },
        status: AuthStatusEnum.AUTHENTICATED,
      });
      return;
    }

    setAuthState({
      token: null,
      user: null,
      status: AuthStatusEnum.UNAUTHENTICATED,
    });
  }, []);

  // If any admin API call comes back 401 (expired/invalid token), adminApi already
  // clears localStorage and fires this event — subscribe and drop the session so
  // the user is bounced back to the login screen instead of seeing stuck/broken
  // tabs with silent fetch failures.
  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthState({
        token: null,
        user: null,
        status: AuthStatusEnum.UNAUTHENTICATED,
      });
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    const resData = await loginAdmin(email, password);
    const authToken = resData.token;
    const authUser = resData.user || { id: 1, email, name: "Admin T99" };

    if (typeof window !== "undefined") {
      localStorage.setItem("barber_admin_token", authToken);
      localStorage.setItem("barber_admin_user", JSON.stringify(authUser));
    }

    setAuthState({
      token: authToken,
      user: authUser,
      status: AuthStatusEnum.AUTHENTICATED,
    });
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("barber_admin_token");
      localStorage.removeItem("barber_admin_user");
    }
    setAuthState({
      token: null,
      user: null,
      status: AuthStatusEnum.UNAUTHENTICATED,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        authStatus: authState.status,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
