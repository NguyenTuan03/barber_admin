"use client";

import React, { createContext, useContext, useState } from "react";
import { AuthStatusEnum } from "@/enum/AppEnum";
import { AuthUser } from "@/types/auth";
import { loginAdmin } from "@/services/adminApi";

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
  const [authState, setAuthState] = useState<{
    token: string | null;
    user: AuthUser | null;
    status: AuthStatusEnum;
  }>(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("barber_admin_token");
      const storedUser = localStorage.getItem("barber_admin_user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as AuthUser;
          return {
            token: storedToken,
            user: parsedUser,
            status: AuthStatusEnum.AUTHENTICATED,
          };
        } catch {
          localStorage.removeItem("barber_admin_token");
          localStorage.removeItem("barber_admin_user");
        }
      } else if (storedToken) {
        return {
          token: storedToken,
          user: { id: 1, email: "admin@t99barber.com", name: "Admin T99" },
          status: AuthStatusEnum.AUTHENTICATED,
        };
      }
    }
    return {
      token: null,
      user: null,
      status: AuthStatusEnum.UNAUTHENTICATED,
    };
  });

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
