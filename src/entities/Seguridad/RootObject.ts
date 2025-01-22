import { Usuario } from "../Usuario";
import { Configuracion } from "./Configuracion";
import { Menu } from "./Menu";
import { PermisosModulo } from "./PermisosModulo";

export interface RootObject {
    Usuario: Usuario;
    Token: string;
    Configuracion: Configuracion;
    PermisosModulos: PermisosModulo[];
    PermisosPaginas: any;
    PermisosBotones: any;
    Menu: Menu;
}