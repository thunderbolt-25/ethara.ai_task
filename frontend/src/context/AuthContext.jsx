import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ttm_user");
    return stored ? JSON.parse(stored) : null;
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
