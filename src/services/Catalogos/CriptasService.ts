import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { Criptas } from "../../entities/catalogos/criptas/Criptas";
import { EntServicios } from "../../entities/catalogos/servicios/EntServicios";

const getToken = () => localStorage.getItem("authToken");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};

export class CriptasService {
  static async updateStatusServicios(id: string, estatus: boolean): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/servicios/UpdateStatus`, { id, estatus }, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  static async deleteServicios(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/servicios/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  static async createServicios(payload: EntServicios): Promise<ApiResponse<EntServicios>> {
    try {
      const { Id, ...newPayload } = payload;
      const response = await axios.post(`${apiUrl}/servicios/Create`, newPayload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateServicios(payload: EntServicios): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/servicios/Update`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  static async getList(): Promise<ApiResponse<EntServicios[]>> {
    try {
      const response = await axios.get(`${apiUrl}/servicios/List`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
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
  static async getCriptasDisponiblesBySeccion(idSeccion: string | undefined): Promise<ApiResponse<Criptas[]>> {
    try {
      const response = await axios.get(`${apiUrl}/criptas/ListDisponible/${idSeccion}`, { headers });
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
