

export interface Usuario {
    IdUsuario: string | null;
    IdPerfil: string;
    Correo: string;
    Password: string | null;
    Nombres: string;
    Apellidos: string;
    Telefono: string;
    Eliminable: boolean | null;
    FechaCreacion: string | null;
    Activo: boolean;
}