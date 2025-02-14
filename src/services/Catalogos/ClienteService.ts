import axios from "axios";
import { apiUrl } from "../../config/globals";
import { GenericService } from "../GenericService";
import { ApiResponse } from "../../entities/ApiResponse";
import { ClienteCreatePayload, Cliente, ClienteUpdatePayload, ClienteUpdateStatusPayload, ClienteFilters } from "../../entities/Cliente";
import { PagedResult } from "../../entities/PagedResult";
import { MisCriptas } from "../../entities/Administracion/Clientes/MisCriptas";

const getToken = () => localStorage.getItem("authToken");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};

export class ClienteService {
  static async createCliente(payload: ClienteCreatePayload): Promise<ApiResponse<Cliente>> {
    try {
      const response = await axios.post(`${apiUrl}/Clientes/Create`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateCliente(payload: ClienteUpdatePayload): Promise<ApiResponse<Cliente>> {
    try {
      const response = await axios.put(`${apiUrl}/Clientes/Update`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateClienteStatus(payload: ClienteUpdateStatusPayload): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/Clientes/UpdateStatus`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async deleteCliente(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/Clientes/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getClienteById(id: string): Promise<ApiResponse<Cliente>> {
    try {
      const response = await axios.get(`${apiUrl}/Clientes/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getClientesByFilters(payload: Partial<ClienteFilters>): Promise<ApiResponse<PagedResult<Cliente>>> {
    try {
      const response = await axios.post(`${apiUrl}/Clientes/ByFilters`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  static async getMyCriptas(uIdCliente: string): Promise<ApiResponse<MisCriptas[]>> {
    try {
      const response = await axios.get(`${apiUrl}/Clientes/MisCriptas/${uIdCliente}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getClientesList(): Promise<ApiResponse<Cliente[]>> {
    try {
      const response = await axios.get(`${apiUrl}/Clientes/List`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default ClienteService;
