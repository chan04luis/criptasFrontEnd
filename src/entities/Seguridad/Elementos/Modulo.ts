import { Pagina } from "./Pagina";

export interface Modulo {
    IdModulo: string;
    ClaveModulo: string;
    NombreModulo: string;
    PathModulo: string;
    MostrarEnMenu: boolean;
    Paginas: Pagina[];
  }