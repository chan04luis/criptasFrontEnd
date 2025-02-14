import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { EntTipoDeMantenimiento } from "../../entities/catalogos/tipo_mantenimientos/EntTipoDeMantenimiento";

const getToken = () => localStorage.getItem("authToken");
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
};

export class TipoDeMantenimientoService {
    static async get(): Promise<ApiResponse<EntTipoDeMantenimiento[]>> {
        try {
            const response = await axios.get(`${apiUrl}/tipoDeMantenimiento/List`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getActive(): Promise<ApiResponse<EntTipoDeMantenimiento[]>> {
        try {
            const response = await axios.get(`${apiUrl}/tipoDeMantenimiento/ListActive`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getById(id: string): Promise<ApiResponse<EntTipoDeMantenimiento>> {
        try {
            const response = await axios.get(`${apiUrl}/tipoDeMantenimiento/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async create(payload: EntTipoDeMantenimiento): Promise<ApiResponse<EntTipoDeMantenimiento>> {
        try {
            const { Id, ...newPayload } = payload;
            const response = await axios.post(`${apiUrl}/tipoDeMantenimiento/Create`, newPayload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async update(payload: EntTipoDeMantenimiento): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/tipoDeMantenimiento/Update`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updateStatus(id: string, estatus: boolean): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/tipoDeMantenimiento/UpdateStatus`, { id, estatus }, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async delete(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.delete(`${apiUrl}/tipoDeMantenimiento/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    private static handleError<T>(error: any): ApiResponse<T> {
        return GenericService.handleError<T>(error);
    }
}

export default TipoDeMantenimientoService;
