import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin } from "../api/auth"; // Suponiendo que este archivo sea donde tienes tu función login

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    
    if (response.HttpCode === 200 && !response.HasError) {
      const userData = {
        id: response.Result.Id,
        name: `${response.Result.Nombres} ${response.Result.Apellidos}`,
        email: response.Result.Correo,
        token: response.Result.Token,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Guardar usuario y token en localStorage
    } else {
      console.error("Login failed:", response.Message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Eliminar del localStorage
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
