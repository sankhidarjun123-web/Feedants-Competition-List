import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApi } from "../api/auth.api";

type User = {
  _id: string;
  username: string;
  email: string;
  isLogin: boolean;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type LoginData = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;

  login: (
    username: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  // -------------------------
  // CHECK AUTH
  // -------------------------

  const checkAuth = async () => {
    try {
      setLoading(true);

      const email = await AsyncStorage.getItem("email");

      if (!email) {
        setUser(null);
        return;
      }

      const response = await authApi.checkAuth(email);

      if (!response.data.authenticated) {
        await AsyncStorage.removeItem("email");
        setUser(null);
        return;
      }

      setUser(response.data.user);
    } catch (error) {
      console.log("Auth check error:", error);

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // REGISTER
  // -------------------------

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authApi.register({
        username,
        email,
        password,
      });

      const user = response.data.user;

      await AsyncStorage.setItem("email", user.email);

      setUser(user);
    } catch (error: any) {
      console.log(
        "Register error:",
        error.response?.data || error
      );

      throw error;
    }
  };

  // -------------------------
  // LOGIN
  // -------------------------

  const login = async (
    username: string,
    password: string
  ) => {
    try {
      const response = await authApi.login({
        username,
        password,
      });

      const user = response.data.user;

      await AsyncStorage.setItem("email", user.email);

      setUser(user);
    } catch (error: any) {
      console.log(
        "Login error:",
        error.response?.data || error
      );

      throw error;
    }
  };

  // -------------------------
  // LOGOUT
  // -------------------------

  const logout = async () => {
    try {
      if (!user) return;

      await authApi.logout({
        email: user.email,
      });

      await AsyncStorage.removeItem("email");

      setUser(null);
    } catch (error: any) {
      console.log(
        "Logout error:",
        error.response?.data || error
      );

      throw error;
    }
  };

  // -------------------------
  // INITIAL AUTH CHECK
  // -------------------------

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,

        register,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -------------------------
// CUSTOM HOOK
// -------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};