import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { RootObject } from '../../entities/Seguridad/RootObject';
import PerfilService from './PerfilService';

const getToken = () => localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class AutenticationService {
  static async get(): Promise<ApiResponse<RootObject>> {
    try {
      const response = await axios.get(`${apiUrl}/autenticacion/actualizarToken`, { headers });
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
