import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { Configuracion } from '../../entities/Seguridad/Configuracion';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { Modulo } from '../../entities/Seguridad/Elementos/Modulo';

const getToken = () => localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class ConfiguracionService {
  static async getConfiguracion(): Promise<ApiResponse<Configuracion>> {
    try {
      const response = await axios.get(`${apiUrl}/seguridad/configuraciones`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateConfiguracion(payload: Configuracion): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.post(`${apiUrl}/seguridad/configuraciones`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getConfiguracionElementos(): Promise<ApiResponse<Modulo>> {
    try {
      const response = await axios.get(`${apiUrl}/seguridad/configuraciones/elementos/sistema`, {
        headers,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
      return GenericService.handleError<T>(error);
    }
}

export default ConfiguracionService;
