export interface EntPacienteEspera {
    idSalaEspera: string;
    idCita?: string;
    cliente: string;
    servicio: string;
    turno: number;
    fechaIngreso: string; // ISO 8601 Format (YYYY-MM-DDTHH:mm:ssZ)
}
