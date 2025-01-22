import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { Perfil } from '../../entities/Seguridad/Perfil';
import { PerfilPermisos } from '../../entities/Seguridad/Permisos/PerfilPermisos';

const getToken = () => localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class PermisosService {
  static async get(IdPerfil:String): Promise<ApiResponse<PerfilPermisos>> {
    try {
      const response = await axios.get(`${apiUrl}/seguridad/perfiles/${IdPerfil}/permisos`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async post(payload: PerfilPermisos): Promise<ApiResponse<Perfil>> {
    try {
      const response = await axios.post(`${apiUrl}/seguridad/permisos`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default PermisosService;
