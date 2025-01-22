export interface PerfilInfo {
    FechaCreacion: string;
    IdUsuarioCreacion: string | null;
    FechaModificacion: string;
    IdUsuarioModificacion: string | null;
    Activo: boolean;
    IdPerfil: string | null;
    ClavePerfil: string | null;
    NombrePerfil: string | null;
    Eliminable: boolean;
  }