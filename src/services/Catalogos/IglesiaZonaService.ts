import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { Zona } from "../../entities/catalogos/zonas/Zona";

const getToken = () => localStorage.getItem("authToken");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};

export class IglesiaZonaService {
  static async createOrUpdateZona(payload: Zona): Promise<ApiResponse<boolean>> {
    try {
      const endpoint = payload.Id ? "/Iglesias/zonas/update" : "/Iglesias/zonas/create";
      const response = payload.Id ? await axios.put(`${apiUrl}${endpoint}`, payload, { headers }) : await axios.post(`${apiUrl}${endpoint}`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async UpdateEstatusZona(payload: Zona): Promise<ApiResponse<boolean>> {
    try {
      const endpoint ="/Iglesias/zonas/UpdateStatus";
      const response = await axios.put(`${apiUrl}${endpoint}`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async deleteZona(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/Iglesias/zonas/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getZonasByIglesia(idIglesia: string | undefined): Promise<ApiResponse<Zona[]>> {
    try {
      const response = await axios.get(`${apiUrl}/Iglesias/zonas/List/${idIglesia}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default IglesiaZonaService;
