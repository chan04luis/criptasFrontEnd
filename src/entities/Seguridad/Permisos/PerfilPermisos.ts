import { PerfilInfo } from "./PerfilInfo";
import { PermisoModulo } from "./PermisoModulo";

export interface PerfilPermisos {
    Perfil: PerfilInfo;
    IdPerfil: String | null;
    Permisos: PermisoModulo[];
  }