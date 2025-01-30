import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { Iglesia } from '../../entities/catalogos/iglesias/Iglesia';
import { IglesiaByFilters } from '../../entities/catalogos/iglesias/IglesiaByFilters';
import { IglesiaCreate } from '../../entities/catalogos/iglesias/IglesiaCreate';
import { IglesiaUpdate } from '../../entities/catalogos/iglesias/IglesiaUpdate';
import { IglesiaUpdateMaps } from '../../entities/catalogos/iglesias/IglesiaUpdateMaps';
import { GenericService } from '../GenericService';

const getToken = () => localStorage.getItem("authToken");
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

export class IglesiaService {
  static async createIglesia(payload: IglesiaCreate): Promise<ApiResponse<Iglesia>> {
    try {
      const response = await axios.post(`${apiUrl}/Iglesias/Create`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateIglesia(payload: IglesiaUpdate): Promise<ApiResponse<Iglesia>> {
    try {
      const response = await axios.put(`${apiUrl}/Iglesias/Update`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateIglesiaMaps(payload: IglesiaUpdateMaps): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/Iglesias/UpdateMaps`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateIglesiaStatus(id: string, estatus: boolean): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/Iglesias/UpdateStatus`, { Id: id, Estatus: estatus }, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async deleteIglesia(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/Iglesias/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getIglesiaById(id: string): Promise<ApiResponse<Iglesia>> {
    try {
      const response = await axios.get(`${apiUrl}/Iglesias/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getIglesias(): Promise<ApiResponse<Iglesia[]>> {
    try {
      const response = await axios.get(`${apiUrl}/Iglesias/List`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getIglesiasByFilters(payload: IglesiaByFilters): Promise<ApiResponse<Iglesia[]>> {
    try {
      const response = await axios.post(`${apiUrl}/Iglesias/ByFilters`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default IglesiaService;
