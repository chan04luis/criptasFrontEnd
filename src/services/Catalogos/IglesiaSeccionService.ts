import axios from "axios"; 
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { Secciones } from "../../entities/catalogos/secciones/Secciones";

const getToken = () => localStorage.getItem("authToken");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};

export class IglesiaSeccionService {
  static async createOrUpdateSeccion(payload: Secciones): Promise<ApiResponse<boolean>> {
    try {
      const endpoint = payload.Id ? "/Iglesias/Zonas/Secciones/update" : "/Iglesias/Zonas/Secciones/create";
      const response = payload.Id ? await axios.put(`${apiUrl}${endpoint}`, payload, { headers }) : await axios.post(`${apiUrl}${endpoint}`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async UpdateEstatusSeccion(payload: Secciones): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.put(`${apiUrl}/Iglesias/Zonas/Secciones/UpdateStatus`, payload, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async deleteSeccion(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${apiUrl}/Iglesias/Zonas/Secciones/${id}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getSeccionesByZona(idZona: string | undefined): Promise<ApiResponse<Secciones[]>> {
    try {
      const response = await axios.get(`${apiUrl}/Iglesias/Secciones/List/${idZona}`, { headers });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    return GenericService.handleError<T>(error);
  }
}

export default IglesiaSeccionService;
