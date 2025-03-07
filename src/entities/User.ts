export interface User {
  Id: string;
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Contra?: string;
  Telefono: string;
  IdPerfil: String;
  Activo: boolean;
  Perfil: String;
  FechaRegistro: string;
  FechaActualizacion: string;
}

export interface UserCreatePayload {
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Contra?: string;
  Telefono: string;
  IdPerfil: String;
  Activo: boolean;
}

export interface UserUpdatePayload {
  Id: string;
  IdPerfil: String;
  Nombres: string;
  Apellidos: string;
  Telefono: string;
}

export interface UserUpdateStatusPayload {
  Id: string;
  Estatus: boolean;
}

export interface UserFilterPayload {
  Id?: string;
  IdPerfil?: string;
  Nombres?: string;
  Apellidos?: string;
  Estatus?: boolean;
}

export interface UserChangePassPayload {
  Id: string | undefined | null;
  Email: string | undefined;
  Contra: string;
  NewContra: string;
  ConfirmNewContra: string;
}

