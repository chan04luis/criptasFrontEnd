import axios from "axios";

const API_URL = "https://gownetwork.icu:444/api/Login";

export const login = async (email, password) => {
  try {
    const response = await axios.patch(API_URL, { Correo: email, Contra: password });
    return response.data;
  } catch (error) {
    return error.response?.data || { HttpCode: 500, HasError: true, Message: "Error desconocido" };
  }
};
