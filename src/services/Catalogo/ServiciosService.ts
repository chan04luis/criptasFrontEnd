import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { EntServicios } from "../../entities/Catalogos/servicios/EntServicios";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
});

export class ServiciosService {
    static async getList(): Promise<ApiResponse<EntServicios[]>> {
        try {
            const response = await axios.get(`${apiUrl}/servicios/List`, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getActive(): Promise<ApiResponse<EntServicios[]>> {
        try {
            const response = await axios.get(`${apiUrl}/servicios/ListActive`, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getById(id: string): Promise<ApiResponse<EntServicios>> {
        try {
            const response = await axios.get(`${apiUrl}/servicios/${id}`, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async create(payload: EntServicios): Promise<ApiResponse<EntServicios>> {
        try {
            const { Id, ...newPayload } = payload;
            const response = await axios.post(`${apiUrl}/servicios/Create`, newPayload, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async update(payload: EntServicios): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/servicios/Update`, payload, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updateStatus(id: string, estatus: boolean): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/servicios/UpdateStatus`, { id, estatus }, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async delete(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.delete(`${apiUrl}/servicios/${id}`, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    private static handleError<T>(error: any): ApiResponse<T> {
        return GenericService.handleError<T>(error);
    }
}

export default ServiciosService;
