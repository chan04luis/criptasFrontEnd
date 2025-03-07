import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { EntSalaConsulta } from "../../entities/AtencionMedica/EntSalaConsulta";

const getToken = () => localStorage.getItem("authToken");

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
};

export class SalaConsultaService {
    static async obtenerSalasDisponibles(idSucursal: string): Promise<ApiResponse<EntSalaConsulta[]>> {
        const response = await axios.get(`${apiUrl}/AtencionMedica/SalasDisponibles/${idSucursal}`, { headers });
        return response.data;
    }

    static async registrarEntradaConsulta(idSucursal: string): Promise<ApiResponse<boolean>> {
        const payload = { idSucursal };
        const response = await axios.post(`${apiUrl}/AtencionMedica/Salas/EntradaConsulta`, payload, { headers });
        return response.data;
    }

    static async registrarSalidaConsulta(idDoctor: string, idSucursal: string): Promise<ApiResponse<boolean>> {
        const payload = { idDoctor, idSucursal };
        const response = await axios.put(`${apiUrl}/AtencionMedica/Salas/SalidaConsulta`, payload, { headers });
        return response.data;
    }
}

export default SalaConsultaService;
