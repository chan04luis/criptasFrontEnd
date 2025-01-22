import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { Boton } from '../../entities/Seguridad/Elementos/Boton';

const getToken = () => localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class BotonService {
  static async post(payload : Boton): Promise<ApiResponse<Boton>> {
    try {
      const response = await axios.post(`${apiUrl}/seguridad/botones`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async put(payload: Boton): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/seguridad/botones/`+payload.IdBoton, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/seguridad/botones/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default BotonService;
