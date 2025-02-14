import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { EntServicios } from "../../entities/catalogos/servicios/EntServicios";

const getToken = () => localStorage.getItem("authToken");
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
};

export class ServiciosService {
    static async getList(): Promise<ApiResponse<EntServicios[]>> {
        try {
            const response = await axios.get(`${apiUrl}/servicios/List`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getActive(): Promise<ApiResponse<EntServicios[]>> {
        try {
            const response = await axios.get(`${apiUrl}/servicios/ListActive`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getById(id: string): Promise<ApiResponse<EntServicios>> {
        try {
            const response = await axios.get(`${apiUrl}/servicios/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async create(payload: EntServicios): Promise<ApiResponse<EntServicios>> {
        try {
            const { Id, ...newPayload } = payload;
            const response = await axios.post(`${apiUrl}/servicios/Create`, newPayload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async update(payload: EntServicios): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/servicios/Update`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updateStatus(id: string, estatus: boolean): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/servicios/UpdateStatus`, { id, estatus }, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async delete(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.delete(`${apiUrl}/servicios/${id}`, { headers });
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
