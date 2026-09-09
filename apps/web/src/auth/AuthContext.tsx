import { createContext, useContext, useState, type ReactNode } from "react";
import { tokenStorage } from "@/lib/tokenStorage";
import { authApi } from "./authApi";
import type { LoginRequest, RegisterRequest } from "./types";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // if token exists in localStorage, user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!tokenStorage.getAccessToken(),
  );

  const login = async (payload: LoginRequest) => {
    const tokens = await authApi.login(payload);
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setIsAuthenticated(true);
  };

  const register = async (payload: RegisterRequest) => {
    const tokens = await authApi.register(payload);
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    tokenStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// a hook for the AuthContext, to be used in components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, must be used within an AuthProvider");
  return ctx;
}
