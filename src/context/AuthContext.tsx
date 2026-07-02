import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type User, type LoginCredentials } from "../types";
import authService from "../service/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; message?: string; user?: User }>;
  signup: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        const response = await authService.getProfile();
        if (response.success && response.user) {
          setUser(response.user);
          authService.updateLocalUser(response.user);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.user) {
        setUser(response.user);
        return {
          success: true,
          message: response.message || "Login successful",
          user: response.user,
        };
      } else {
        return {
          success: false,
          message: response.error || "Login failed",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  };

  const signup = async (data: any) => {
    try {
      const response = await authService.signup(data);

      if (response.success) {
        return {
          success: true,
          message: response.message || "Signup successful! Please login.",
        };
      } else {
        return {
          success: false,
          message: response.error || "Signup failed",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Signup failed",
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    authService.updateLocalUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
