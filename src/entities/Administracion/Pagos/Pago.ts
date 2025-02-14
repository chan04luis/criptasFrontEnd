export interface Pago {
    Id: string;
    IdCliente: string;
    IdCripta: string;
    IdTipoPago: string;
    MontoTotal: number;
    FechaLimite: string;
    Pagado: boolean;
    FechaRegistro: string;
    FechaActualizacion: string;
    Estatus: boolean;
    MontoPagado: number;
    FechaPagado: string;
}
