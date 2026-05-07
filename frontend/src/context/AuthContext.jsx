import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ttm_user");
      if (!stored || stored === "undefined" || stored === "null") {
        return null;
      }
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      localStorage.removeItem("ttm_user");
      localStorage.removeItem("ttm_token");
      return null;
    }
  });

  const login = (authData) => {
    localStorage.setItem("ttm_token", authData.token);
    localStorage.setItem("ttm_user", JSON.stringify(authData.user));
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
