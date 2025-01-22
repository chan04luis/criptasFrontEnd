import { Pagina } from "./Pagina";

export interface Seguridad {
    nombre: string;
    mostrar: boolean;
    _paginas: { [key: string]: Pagina };
}