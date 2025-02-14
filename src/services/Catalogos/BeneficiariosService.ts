import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { GenericService } from "../GenericService";
import { EntBeneficiarios } from "../../entities/catalogos/beneficiarios/EntBeneficiarios";
import { EntBeneficiariosRequest } from "../../entities/catalogos/beneficiarios/EntBeneficiariosRequest";
import { EntBeneficiariosUpdateRequest } from "../../entities/catalogos/beneficiarios/EntBeneficiariosUpdateRequest";

const getToken = () => localStorage.getItem("authToken");
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
};

export class BeneficiariosService {
    static async getById(id: string): Promise<ApiResponse<EntBeneficiarios[]>> {
        try {
            const response = await axios.get(`${apiUrl}/Criptas/Beneficiarios/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async create(payload: EntBeneficiariosRequest): Promise<ApiResponse<EntBeneficiarios>> {
        try {
            const response = await axios.post(`${apiUrl}/Criptas/Beneficiarios/Create`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async update(payload: EntBeneficiariosUpdateRequest): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/Criptas/Beneficiarios/Update`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async delete(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.delete(`${apiUrl}/Criptas/Beneficiarios/Delete/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    private static handleError<T>(error: any): ApiResponse<T> {
        return GenericService.handleError<T>(error);
    }
}

export default BeneficiariosService;
