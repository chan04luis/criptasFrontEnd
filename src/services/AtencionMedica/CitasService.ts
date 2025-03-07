import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { CitaRequest } from "../../entities/AtencionMedica/CitaRequest";
import { CitasFiltroRequest } from "../../entities/AtencionMedica/CitasFiltroRequest";
import { EntCitaEditable } from "../../entities/AtencionMedica/EntCitaEditable";
import { GenericService } from "../GenericService";

const getToken = () => localStorage.getItem("authToken");

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
};

export class CitasService {
    static async obtenerCitas(filtro: CitasFiltroRequest): Promise<ApiResponse<EntCitaEditable[]>> {
        const response = await axios.post(`${apiUrl}/AtencionMedica/Citas/Filtrar`, filtro, { headers });
        return response.data;
    }

    static async guardarCita(cita: CitaRequest): Promise<ApiResponse<EntCitaEditable>> {
        const response = await axios.post(`${apiUrl}/AtencionMedica/Citas/Crear`, cita, { headers });
        return response.data;
    }

    static async actualizarCita(id: string, cita: CitaRequest): Promise<ApiResponse<boolean>> {
        const response = await axios.put(`${apiUrl}/AtencionMedica/Citas/Actualizar/${id}`, cita, { headers });
        return response.data;
    }

    static async cancelarCita(id: string): Promise<ApiResponse<boolean>> {
        const response = await axios.put(`${apiUrl}/AtencionMedica/Citas/Cancelar/${id}`, {}, { headers });
        return response.data;
    }

    static async atenderTurno(idCita: string, idSucursal: String): Promise<ApiResponse<boolean>> {
        const response = await axios.put(`${apiUrl}/AtencionMedica/Citas/Atender`, { idCita, idSucursal }, { headers });
        return response.data;
    }

    static async obtenerTurnoActual(idSucursal: string): Promise<ApiResponse<EntCitaEditable>> {
        const response = await axios.get(`${apiUrl}/AtencionMedica/Citas/TurnoActual/${idSucursal}`, { headers });
        return response.data;
    }

    static async obtenerSiguientesTurnos(idSucursal: string, cantidad: number): Promise<ApiResponse<EntCitaEditable[]>> {
        const response = await axios.get(`${apiUrl}/AtencionMedica/Citas/SiguientesTurnos/${idSucursal}/${cantidad}`, { headers });
        return response.data;
    }

    static async registrarLlegada(idCita: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/AtencionMedica/Citas/Llegada/${idCita}`, {}, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async registrarSalida(idCita: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/AtencionMedica/Citas/Salida/${idCita}`, {}, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    static async reagendarCita(idCita: string, nuevaFecha: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.put(`${apiUrl}/AtencionMedica/Citas/Reagendar/${idCita}`, nuevaFecha, { headers });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    private static handleError<T>(error: any): ApiResponse<T> {
        return GenericService.handleError<T>(error);
    }
}

export default CitasService;
