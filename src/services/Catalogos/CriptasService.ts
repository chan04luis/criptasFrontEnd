import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { Criptas } from "../../entities/catalogos/criptas/Criptas";

const getToken = () => localStorage.getItem("authToken");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};

export class CriptasService {
  static async createOrUpdateCripta(payload: Criptas): Promise<ApiResponse<boolean>> {
    try {
      const endpoint = payload.Id ? "/criptas/update" : "/criptas/create";
      const response = payload.Id
        ? await axios.put(`${apiUrl}${endpoint}`, payload, { headers })
        : await axios.post(`${apiUrl}${endpoint}`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateEstatusCripta(payload: Criptas): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/criptas/UpdateStatus`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async deleteCripta(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/criptas/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getCriptasBySeccion(idSeccion: string | undefined): Promise<ApiResponse<Criptas[]>> {
    try {
      const response = await axios.get(`${apiUrl}/criptas/List/${idSeccion}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getCriptasByCliente(idCliente: string | undefined): Promise<ApiResponse<Criptas[]>> {
    try {
      const response = await axios.get(`${apiUrl}/criptas/cliente/${idCliente}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default CriptasService;
