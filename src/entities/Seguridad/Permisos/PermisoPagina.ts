import { PermisoBoton } from "./PermisoBoton";

export interface PermisoPagina {
    IdPermisoPagina: string;
    IdPagina: string;
    ClavePagina: string;
    NombrePagina: string;
    TienePermiso: boolean;
    PermisosBoton: PermisoBoton[];
  }