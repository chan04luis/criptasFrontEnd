export interface EntBeneficiarios {
    Id: string;
    IdCripta: string;
    Nombre: string;
    IneFrente?: string | null;
    IneReverso?: string | null;
    FechaRegistro: string;
    FechaActualizacion: string;
    Estatus: boolean;
}
