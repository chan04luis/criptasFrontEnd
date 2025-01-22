import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { Pagina } from '../../entities/Seguridad/Elementos/Pagina';

const getToken = () => localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class PaginaService {
  static async post(payload : Pagina): Promise<ApiResponse<Pagina>> {
    try {
      const response = await axios.post(`${apiUrl}/seguridad/modulos/paginas`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async put(payload: Pagina): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/seguridad/modulos/paginas/`+payload.IdPagina, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/seguridad/modulos/paginas/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default PaginaService;
