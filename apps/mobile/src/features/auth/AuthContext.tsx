import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { tokenStorage } from "@/lib/tokenStorage";
import { authApi } from "./authApi";
import type { LoginRequest, RegisterRequest } from "./types";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tokenStorage.getAccessToken().then((token) => {
      setIsAuthenticated(!!token);
      setIsLoading(false);
    });
  }, []);

  const login = async (payload: LoginRequest) => {
    const tokens = await authApi.login(payload);
    await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setIsAuthenticated(true);
  };

  const register = async (payload: RegisterRequest) => {
    const tokens = await authApi.register(payload);
    await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await tokenStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, must be used within an AuthProvider");
  return ctx;
}
