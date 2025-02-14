import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { GenericService } from '../GenericService';
import { Pago } from '../../entities/Administracion/Pagos/Pago';
import { PagoCreate } from '../../entities/Administracion/Pagos/PagoCreate';
import { PagoAplicar } from '../../entities/Administracion/Pagos/PagoAplicar';
import { PagoUpdate } from '../../entities/Administracion/Pagos/PagoUpdate';
import { PagoUpdateStatus } from '../../entities/Administracion/Pagos/PagoUpdateStatus';
import { PagoParcialidad } from '../../entities/Administracion/Pagos/PagoParcialidad';
import { ApiResponse } from '../../entities/ApiResponse';
import { PagoFiltros } from '../../entities/Administracion/Pagos/PagoFiltros';
import { PagedResult } from '../../entities/PagedResult';
import { PagoLista } from '../../entities/Administracion/Pagos/PagoLista';

const getToken = () => localStorage.getItem('authToken');
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
};

export class PagosService {
    static async listPago(payload: PagoFiltros): Promise<ApiResponse<PagedResult<PagoLista>>> {
        try {
            const response = await axios.post(`${apiUrl}/Pagos/ByFilters`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }
    static async createPago(payload: PagoCreate): Promise<ApiResponse<Pago>> {
        try {
            const response = await axios.post(`${apiUrl}/Pagos/Create`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updatePago(payload: PagoUpdate): Promise<ApiResponse<Pago>> {
        try {
            const response = await axios.put(`${apiUrl}/Pagos/Update`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async aplicarPago(payload: PagoAplicar): Promise<ApiResponse<Pago>> {
        try {
            const response = await axios.put(`${apiUrl}/Pagos/AplicarPago`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async cancelarPago(idPago: string): Promise<ApiResponse<Pago>> {
        try {
            const response = await axios.put(`${apiUrl}/Pagos/CancelarPago/${idPago}`, {}, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async updateStatus(payload: PagoUpdateStatus): Promise<ApiResponse<Pago>> {
        try {
            const response = await axios.put(`${apiUrl}/Pagos/UpdateStatus`, payload, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async deletePago(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.delete(`${apiUrl}/Pagos/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getPagoById(id: string): Promise<ApiResponse<Pago>> {
        try {
            const response = await axios.get(`${apiUrl}/Pagos/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async getParcialidadesByPago(id: string): Promise<ApiResponse<PagoParcialidad[]>> {
        try {
            const response = await axios.get(`${apiUrl}/Pagos/Parcialidades/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async deleteParcialidad(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.delete(`${apiUrl}/Pagos/Parcialidades/${id}`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    private static handleError<T>(error: any): ApiResponse<T> {
        return GenericService.handleError<T>(error);
    }
}

export default PagosService;
