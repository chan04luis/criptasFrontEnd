import axios from 'axios';
import { apiUrl } from '../../config/globals';
import { ApiResponse } from '../../entities/ApiResponse';
import { GenericService } from '../GenericService';
import { TipoPagos } from '../../entities/Administracion/Pagos/TipoPagos';

const getToken = () => localStorage.getItem('authToken');
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
};

export class TipoPagosService {
    static async get(): Promise<ApiResponse<TipoPagos[]>> {
        try {
            const response = await axios.get(`${apiUrl}/Pagos/Tipos`, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    private static handleError<T>(error: any): ApiResponse<T> {
        return GenericService.handleError<T>(error);
    }
}

export default TipoPagosService;
