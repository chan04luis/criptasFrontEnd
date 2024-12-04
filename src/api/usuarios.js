import axios from "axios";

// Recuperar el token del localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.token : null;
};

// API base URL
const API_URL = "https://gownetwork.icu:444/api/Usuarios";

// Función para obtener usuarios
export const getUsuarios = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token no disponible");

    const response = await axios.get(`${API_URL}/List`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "text/plain",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Función para crear un nuevo usuario
export const createUsuario = async (usuarioData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token no disponible");

    const response = await axios.post(
      `${API_URL}/Create`,
      usuarioData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

// Función para actualizar un usuario
export const updateUsuario = async (usuarioData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token no disponible");

    const response = await axios.put(
      `${API_URL}/Update`,
      usuarioData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

// Función para cambiar el estado de un usuario
export const updateUsuarioStatus = async (id, estatus) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token no disponible");

    const response = await axios.put(
      `${API_URL}/UpdateStatus`,
      { Id: id, Estatus: estatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    throw error;
  }
};

// Función para eliminar un usuario
export const deleteUsuario = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token no disponible");

    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};
