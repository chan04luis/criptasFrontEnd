export interface EntCitaEditable {
    Id: string;
    IdCliente: string;
    IdSucursal: string;
    IdServicio: string;
    IdDoctor?: string;
    FechaCita: string;
    Estado: string;
    Turno: number;
    RegistradoEnPiso: boolean;
    FechaRegistro: string;
    FechaActualizacion: string;
    Cliente: string;
    Sucursal: string;
    Servicio: string;
    Doctor?: string;
}
