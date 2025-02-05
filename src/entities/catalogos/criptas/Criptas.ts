export interface Criptas{
    Id : string;
    IdSeccion : string | undefined;
    IdCliente : string | undefined;
    Numero: string;
    Precio: number;
    UbicacionEspecifica : string;
    Estatus : boolean;
    FechaRegistro: string;
    FechaActualizacion: string;
}