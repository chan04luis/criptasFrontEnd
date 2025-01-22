import { Seguridad } from "./Seguridad";

export interface Menu {
    SEGURIDAD: Seguridad;
    _paths: { [key: string]: string };
}