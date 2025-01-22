import { Boton } from "./Boton";

export interface Pagina {
    IdPagina: string;
    IdModulo: string;
    ClavePagina: string;
    NombrePagina: string;
    PathPagina: string;
    MostrarEnMenu: boolean;
    Botones: Boton[];
  }