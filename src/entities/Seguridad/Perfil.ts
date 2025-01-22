export interface Perfil {
    IdPerfil: string;
    ClavePerfil: string;
    NombrePerfil: string;
    Eliminable: boolean;
    FechaCreacion?: string;
    IdUsuarioCreacion?: string | null;
    FechaModificacion?: string;
    IdUsuarioModificacion?: string | null;
    Activo: boolean;
  }