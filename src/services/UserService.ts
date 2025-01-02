import axios from 'axios';
import { apiUrl } from '../config/globals';
import {
  User,
  UserCreatePayload,
  UserUpdatePayload,
  UserUpdateStatusPayload,
  UserFilterPayload,
  ApiResponse,
} from '../entities/User';
import { toast } from 'react-toastify';

const getToken = () => localStorage.getItem("authToken");
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

class UserService {
  static async createUser(payload: UserCreatePayload): Promise<ApiResponse<User>> {
    try {
      const response = await axios.post(`${apiUrl}/Usuarios/Create`, payload, { headers });
      if (response.data.HasError) {
        toast.error(response.data.Message);
      }
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async updateUser(payload: UserUpdatePayload): Promise<ApiResponse<User>> {
    try {
      const response = await axios.put(`${apiUrl}/Usuarios/Update`, payload, { headers });
      if (response.data.HasError) {
        toast.error(response.data.Message);
      } 
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async updateUserStatus(payload: UserUpdateStatusPayload): Promise<ApiResponse<User>> {
    try {
      const response = await axios.put(`${apiUrl}/Usuarios/UpdateStatus`, payload, { headers });
      if (response.data.HasError) {
        toast.error(response.data.Message);
      }
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/Usuarios/${id}`, { headers });
      if (response.data.HasError) {
        toast.error(response.data.Message);
      }
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await axios.get(`${apiUrl}/Usuarios/${id}`, { headers });
      if (response.data.HasError) {
        toast.error(response.data.Message);
      } 
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async getUsersByFilters(payload: UserFilterPayload): Promise<ApiResponse<User[]>> {
    try {
      const response = await axios.post(`${apiUrl}/Usuarios/ByFilters`, payload, { headers });
      if (response.data.HasError) {
        toast.error(response.data.Message);
      }
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private static handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Si el error es 401 (no autorizado), limpiar tokens y redirigir
        localStorage.removeItem('authToken');
        localStorage.removeItem('authId');
        window.location.href = '/login';
        toast.error('Sesión expirada, inicia sesión nuevamente');
      } else if (error.response?.data?.Message) {
        toast.error(error.response.data.Message);
      } else {
        toast.error('Hubo un error al procesar la solicitud');
      }
    } else {
      toast.error('Error desconocido. Por favor, intenta nuevamente.');
    }
    throw error; // Volver a lanzar el error para manejarlo en el nivel superior si es necesario
  }
}

export default UserService;
