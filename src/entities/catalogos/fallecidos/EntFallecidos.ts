export interface EntFallecidos {
    Id: string;
    Nombre: string;
    Apellidos: string;
    Nacimiento: string;
    Edad: number;
    Fallecimiento: string;
    ActaDefuncion: string | null;
    AutorizacionIncineracion: string | null;
    AutorizacionTraslado: string | null;
    Estatus: boolean;
    IdCripta: string;
    FechaRegistro: string;
    FechaActualizacion: string;
}
export interface EntFallecidosDocs {
    Id: string;
    Apellidos: string;
    Nacimiento: string;
    ActaDefuncion: string;
    AutorizacionIncineracion: string;
    AutorizacionTraslado: string;
}
