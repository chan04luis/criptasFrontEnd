import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { Perfil } from '../../entities/Seguridad/Perfil';
import { PerfilPayload } from '../../entities/Seguridad/PerfilPayload';

const getToken = () => localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class PerfilService {
  static async get(): Promise<ApiResponse<Perfil[]>> {
    try {
      const response = await axios.get(`${apiUrl}/seguridad/perfiles`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getById(id: string): Promise<ApiResponse<Perfil>> {
    try {
      const response = await axios.get(`${apiUrl}/seguridad/perfiles/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async create(payload: PerfilPayload): Promise<ApiResponse<Perfil>> {
    try {
      const response = await axios.post(`${apiUrl}/seguridad/perfiles`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async update(payload: Perfil): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/seguridad/perfiles/`+payload.IdPerfil, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/seguridad/perfiles/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default PerfilService;
