import React, { createContext, useState, useEffect, ReactNode } from "react";
import { apiUrl } from "../config/globals";
// Definimos la estructura de los datos del usuario que se obtendrán de la API
interface User {
  Id: string;
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Contra: string;
  Telefono: string;
  Activo: boolean;
  FechaRegistro: string;
  FechaActualizacion: string;
}

// Definimos la estructura del contexto
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Obtener el token desde localStorage
  const getToken = () => localStorage.getItem("authToken");
  const getId = () => localStorage.getItem("authId");
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      const id = getId();
      if (!token) {
        return; // Si no hay token, no hacemos la solicitud
      }

      try {
        const response = await fetch(
        `${apiUrl}/Usuarios/${id}`,
          {
            method: "GET",
            headers: {
              accept: "text/plain",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          // Si la respuesta es 401, eliminamos el token y redirigimos o hacemos lo que sea necesario
          localStorage.removeItem("authToken");
          localStorage.removeItem("authId");
          window.location.href = "/login"; // Redirigir a la página de login
          return;
        }

        if (!response.ok) {
          throw new Error("Error al obtener el usuario");
        }

        const data = await response.json();
        if (!data.HasError) {
          setUser(data.Result); // Establecer los datos del usuario en el estado
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
    <AuthContext.Provider value={{ user, setUser, logout }}>
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
