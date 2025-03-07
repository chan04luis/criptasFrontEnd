export interface EntSalaConsulta {
    id: string;
    idSucursal: string;
    idDoctor: string;
    fechaEntrada: string; // ISO 8601 Format (YYYY-MM-DDTHH:mm:ssZ)
    disponible: boolean;
}
