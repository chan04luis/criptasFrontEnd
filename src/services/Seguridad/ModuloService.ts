import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { Modulo } from '../../entities/Seguridad/Elementos/Modulo';

const getToken = () => localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class ModuloService {
  static async post(payload : Modulo): Promise<ApiResponse<Modulo>> {
    try {
      const response = await axios.post(`${apiUrl}/seguridad/modulos`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async put(payload: Modulo): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/seguridad/modulos/`+payload.IdModulo, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/seguridad/modulos/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default ModuloService;
