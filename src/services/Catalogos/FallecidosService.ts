import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { EntFallecidos } from "../../entities/catalogos/fallecidos/EntFallecidos";
import { EntFallecidosRequest } from "../../entities/catalogos/fallecidos/EntFallecidosRequest";
import { EntFallecidosUpdateRequest } from "../../entities/catalogos/fallecidos/EntFallecidosUpdateRequest";
import { FallecidosBusqueda } from "../../entities/catalogos/fallecidos/FallecidosBusqueda";
import { EntFallecidosSearchRequest } from "../../entities/catalogos/fallecidos/EntFallecidosSearchRequest";
import { PagedResult } from "../../entities/PagedResult";

const getToken = () => localStorage.getItem("authToken");
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
};

export class FallecidosService {
    /** Obtiene un fallecido por ID */
    static async getById(id: string): Promise<ApiResponse<EntFallecidos[]>> {
        try {
            const response = await axios.get(`${apiUrl}/Criptas/Fallecidos/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getSingle(id: string): Promise<ApiResponse<EntFallecidos>> {
        try {
            const response = await axios.get(`${apiUrl}/Criptas/Fallecido/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    /** Crea un fallecido */
    static async create(payload: EntFallecidosRequest): Promise<ApiResponse<EntFallecidos>> {
        try {
            const response = await axios.post(`${apiUrl}/Criptas/Fallecidos/Create`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }


    static async getFallecidos(payload: EntFallecidosSearchRequest): Promise<ApiResponse<PagedResult<FallecidosBusqueda>>> {
        try {
            const response = await axios.post(`${apiUrl}/Criptas/Fallecidos/Busqueda`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    /** Actualiza un fallecido */
    static async update(payload: EntFallecidosUpdateRequest): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/Criptas/Fallecidos/Update`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updateDocs(payload: EntFallecidos): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/Criptas/Fallecidos/UpdateDocs`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    /** Elimina un fallecido por ID */
    static async delete(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.delete(`${apiUrl}/Criptas/Fallecidos/Delete/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    /** Manejo de errores */
    private static handleError<T>(error: any): ApiResponse<T> {
        return GenericService.handleError<T>(error);
    }
}

export default FallecidosService;
