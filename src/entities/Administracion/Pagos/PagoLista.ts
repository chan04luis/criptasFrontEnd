export interface PagoLista {
    Id: string;
    ClavePago: string;
    IdCliente: string;
    NombreCliente: string;
    ApellidosCliente: string;
    IdCripta: string;
    NumeroCripta: string;
    IdSeccion: string;
    NombreSeccion: string;
    IdZona: string;
    NombreZona: string;
    IdIglesia: string;
    NombreIglesia: string;
    IdTipoPago: string;
    MontoTotal: number;
    MontoPagado: number;
    FechaLimite: string;
    FechaPagado: string;
    Pagado: boolean;
    FechaRegistro: string;
    FechaActualizacion: string;
    Estatus: boolean;
}
