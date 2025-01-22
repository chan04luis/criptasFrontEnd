import axios from 'axios';
import { apiUrl } from '../config/globals';
import {
  User,
  UserCreatePayload,
  UserUpdatePayload,
  UserUpdateStatusPayload,
  UserFilterPayload,
} from '../entities/User';
import {GenericService } from '../services/GenericService'
import { ApiResponse } from '../entities/ApiResponse';

const getToken = () => localStorage.getItem("authToken");
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class UserService {
  static async createUser(payload: UserCreatePayload): Promise<ApiResponse<User>> {
    try {
      const response = await axios.post(`${apiUrl}/Usuarios/Create`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateUser(payload: UserUpdatePayload): Promise<ApiResponse<User>> {
    try {
      const response = await axios.put(`${apiUrl}/Usuarios/Update`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateUserStatus(payload: UserUpdateStatusPayload): Promise<ApiResponse<User>> {
    try {
      const response = await axios.put(`${apiUrl}/Usuarios/UpdateStatus`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/Usuarios/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await axios.get(`${apiUrl}/Usuarios/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getUsersByFilters(payload: UserFilterPayload): Promise<ApiResponse<User[]>> {
    try {
      const response = await axios.post(`${apiUrl}/Usuarios/ByFilters`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default UserService;
