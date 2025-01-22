import React, { createContext, useState, useEffect, ReactNode } from "react";
import { RootObject } from "../entities/Seguridad/RootObject";
import { AutenticationService } from "../services/Seguridad/AutenticationService";
import { Usuario } from "../entities/Usuario";

// Definimos la estructura del contexto
interface AuthContextType {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
  logout: () => void;
  result : RootObject | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [result, setResult] = useState<RootObject | null>(null);

  // Obtener el token desde localStorage
  const getToken = () => localStorage.getItem("authToken");
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      if (!token) {
        return; 
      }else if(token == undefined || token == "undefined"){
        localStorage.removeItem("authToken");
        localStorage.removeItem("authId");
        window.location.href = "/login"; 
      }
      try {
        const response = await AutenticationService.get();
        if(response != null && response != undefined && response.Result != null && response.Result != undefined){
          const result : RootObject = response.Result;
          setUser(result.Usuario);
          setResult(result);
          localStorage.setItem('authToken', result.Token);
          localStorage.setItem('authResult', JSON.stringify(result));
        }else{
          localStorage.removeItem("authToken");
          localStorage.removeItem("authId");
          window.location.href = "/login"; 
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken"); 
    localStorage.removeItem("authId"); 
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, result }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto de autenticación
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
