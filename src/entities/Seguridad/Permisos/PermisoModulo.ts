import { PermisoPagina } from "./PermisoPagina";

export interface PermisoModulo {
    IdPermisoModulo: string;
    IdModulo: string;
    ClaveModulo: string;
    NombreModulo: string;
    TienePermiso: boolean;
    PermisosPagina: PermisoPagina[];
  }