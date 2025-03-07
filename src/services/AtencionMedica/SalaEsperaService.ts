import axios from "axios";
import { apiUrl } from "../../config/globals";
import { ApiResponse } from "../../entities/ApiResponse";
import { EntPacienteEspera } from "../../entities/AtencionMedica/EntPacienteEspera";

const getToken = () => localStorage.getItem("authToken");

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
};

export class SalaEsperaService {
    static async obtenerPacientesEnEspera(idSucursal: string): Promise<ApiResponse<EntPacienteEspera[]>> {
        const response = await axios.get(`${apiUrl}/AtencionMedica/SalaEspera/Pacientes/${idSucursal}`, { headers });
        return response.data;
    }

    static async registrarPacienteEnEspera(idSucursal: string, idCliente: string, idCita?: string): Promise<ApiResponse<boolean>> {
        const payload = { idSucursal, idCliente, idCita };
        const response = await axios.post(`${apiUrl}/AtencionMedica/SalaEspera/Registrar`, payload, { headers });
        return response.data;
    }

    static async actualizarEstadoEspera(idSalaEspera: string, atendido: boolean): Promise<ApiResponse<boolean>> {
        const response = await axios.put(`${apiUrl}/AtencionMedica/SalaEspera/ActualizarEstado/${idSalaEspera}`, { atendido }, { headers });
        return response.data;
    }
}

export default SalaEsperaService;
