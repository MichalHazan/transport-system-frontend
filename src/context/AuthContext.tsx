import { createContext, useState, useEffect } from "react";
import axios from "axios";

export type UserRole = "Client" | "Supplier" | "Admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  token: null,
  isLoggedIn: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

const API = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const isLoggedIn = !!token;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (data: any): Promise<boolean> => {
    try {
      const res = await axios.post(`${API}/auth/register`, data);

      setToken(res.data.token);
      setUser(res.data.user);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const tokenLS = localStorage.getItem("token");
    const userLS = localStorage.getItem("user");

    if (tokenLS && userLS) {
      setToken(tokenLS);
      setUser(JSON.parse(userLS));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isLoggedIn,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
