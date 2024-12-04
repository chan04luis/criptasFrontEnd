export interface User {
    Id: string;
    Nombres: string;
    Apellidos: string;
    Correo: string;
    Contra: string;
    Telefono: string;
    Activo: boolean;
    FechaRegistro: string;
    FechaActualizacion: string;
  }
  
  export interface UserCreatePayload {
    Nombres: string;
    Apellidos: string;
    Correo: string;
    Contra: string;
    Telefono: string;
    Activo: boolean;
  }
  
  export interface UserUpdatePayload {
    Id: string;
    Nombres: string;
    Apellidos: string;
    Telefono: string;
  }
  
  export interface UserUpdateStatusPayload {
    Id: string;
    Estatus: boolean;
  }
  
  export interface UserFilterPayload {
    Id: string;
    Nombres: string;
    Apellidos: string;
    Estatus: boolean;
  }
  
  export interface ApiResponse<T> {
    HttpCode: number;
    HasError: boolean;
    Message: string;
    Result: T;
  }
  