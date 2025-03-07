import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { Sucursal } from '../../entities/Catalogos/sucursales/Sucursal';
import { SucursalByFilters } from '../../entities/Catalogos/sucursales/SucursalByFilters';
import { SucursalCreate } from '../../entities/Catalogos/sucursales/SucursalCreate';
import { SucursalUpdate } from '../../entities/Catalogos/sucursales/SucursalUpdate';
import { SucursalUpdateMaps } from '../../entities/Catalogos/sucursales/SucursalUpdateMaps';
import { EntServicioBySucursal } from '../../entities/Catalogos/servicios/EntServicioBySucursal';

const getToken = () => localStorage.getItem("authToken");
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
};

export class SucursalService {
    static async createSucursal(payload: SucursalCreate): Promise<ApiResponse<Sucursal>> {
        try {
            const response = await axios.post(`${apiUrl}/Sucursales/Create`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updateSucursal(payload: SucursalUpdate): Promise<ApiResponse<Sucursal>> {
        try {
            const response = await axios.put(`${apiUrl}/Sucursales/Update`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updateSucursalMaps(payload: SucursalUpdateMaps): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/Sucursales/UpdateMaps`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updateSucursalestatus(id: string, estatus: boolean): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/Sucursales/UpdateStatus`, { Id: id, Estatus: estatus }, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async deleteSucursal(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.delete(`${apiUrl}/Sucursales/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getSucursalById(id: string): Promise<ApiResponse<Sucursal>> {
        try {
            const response = await axios.get(`${apiUrl}/Sucursales/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getSucursales(): Promise<ApiResponse<Sucursal[]>> {
        try {
            const response = await axios.get(`${apiUrl}/Sucursales/List`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getServiciosBySucursal(IdSucursal: string): Promise<ApiResponse<EntServicioBySucursal[]>> {
        try {
            const response = await axios.get(`${apiUrl}/servicios/ListAssigment/${IdSucursal}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async setServiciosBySucursal(Id: string, payload: EntServicioBySucursal[]): Promise<ApiResponse<Boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/servicios/ListAssigment/Update/${Id}`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getServiciosByUser(Id: string): Promise<ApiResponse<EntServicioBySucursal[]>> {
        try {
            const response = await axios.get(`${apiUrl}/servicios/ListAssigmentUser/${Id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async setServiciosByUser(Id: string, payload: EntServicioBySucursal[]): Promise<ApiResponse<Boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/servicios/ListAssigmentUser/Update/${Id}`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getSucursalByUser(Id: string): Promise<ApiResponse<EntServicioBySucursal[]>> {
        try {
            const response = await axios.get(`${apiUrl}/Sucursales/ListAssigmentUser/${Id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async setSucursalByUser(Id: string, payload: EntServicioBySucursal[]): Promise<ApiResponse<Boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/Sucursales/ListAssigmentUser/Update/${Id}`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getSucursalesByFilters(payload: SucursalByFilters): Promise<ApiResponse<Sucursal[]>> {
        try {
            const response = await axios.post(`${apiUrl}/Sucursales/ByFilters`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    private static handleError<T>(error: any): ApiResponse<T> {
        return GenericService.handleError<T>(error);
    }
}

export default SucursalService;
