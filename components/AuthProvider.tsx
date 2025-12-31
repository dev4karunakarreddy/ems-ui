"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Auth = { token?: string; role?: string };

type AuthContextType = {
  auth: Auth;
  setAuth: (a: Auth) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuthState] = useState<Auth>({});

  useEffect(() => {
    const tokenMatch = document.cookie.match(/(^|;\s*)token=([^;]+)/);
    const roleMatch = document.cookie.match(/(^|;\s*)role=([^;]+)/);
    const token = tokenMatch ? tokenMatch[2] : undefined;
    const role = roleMatch ? roleMatch[2] : undefined;
    if (token || role) setAuthState({ token, role });
  }, []);

  const setAuth = (a: Auth) => {
    setAuthState(a);
    if (a.token) {
      document.cookie = `token=${a.token}; path=/;`;
    } else {
      document.cookie = `token=; max-age=0; path=/;`;
    }
    if (a.role) {
      document.cookie = `role=${a.role}; path=/;`;
    } else {
      document.cookie = `role=; max-age=0; path=/;`;
    }
  };

  const logout = () => {
    setAuth({});
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
