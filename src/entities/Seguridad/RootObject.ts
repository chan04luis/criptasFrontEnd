import { Usuario } from "../Usuario";
import { Configuracion } from "./Configuracion";
import { Menu } from "./Menu";
import { PermisoPagina } from "./Permisos/PermisoPagina";
import { PermisosModulo } from "./PermisosModulo";
import { PermisoBoton } from "./Permisos/PermisoBoton";
import { Sucursal } from "../Catalogos/sucursales/Sucursal";

export interface RootObject {
    Usuario: Usuario;
    Token: string;
    Configuracion: Configuracion;
    PermisosModulos: PermisosModulo[];
    PermisosPaginas: PermisoPagina[];
    PermisosBotones: PermisoBoton[];
    Sucursales: Sucursal[];
    Menu: Menu;
}