export interface EntFallecidosSearchRequest {
    Nombre?: string;
    Apellidos?: string;
    IdIglesia?: string;
    Estatus: boolean | null;
    NumPag: number;
    NumReg: number;
}
