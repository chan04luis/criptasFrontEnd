// Entidad para Cliente
export interface Cliente {
    Id: string;
    Nombres: string;
    Apellidos: string;
    Direccion: string;
    FechaNac: string; // Usar formato ISO 8601
    Sexo: string; // Puede ser un enum dependiendo de la implementación
    Edad: number;
    Telefono: string;
    Email: string;
    FechaRegistro: string; // Usar formato ISO 8601
    FechaActualizacion: string; // Usar formato ISO 8601
    Estatus: boolean; // true para activo, false para inactivo
  }
  
  // Payload para crear un cliente
  export interface ClienteCreatePayload {
    Nombres: string;
    Apellidos: string;
    Direccion: string;
    FechaNac: string; // Usar formato ISO 8601
    Sexo: string;
    Telefono: string;
    Email: string;
  }
  
  // Payload para actualizar un cliente
  export interface ClienteUpdatePayload {
    Id: string;
    Nombres?: string;
    Apellidos?: string;
    Direccion?: string;
    FechaNac?: string; // Usar formato ISO 8601
    Sexo?: string;
    Telefono?: string;
    Email?: string;
  }
  
  // Payload para actualizar el estado de un cliente
  export interface ClienteUpdateStatusPayload {
    Id: string;
    Estatus: boolean;
  }
  
  // Respuesta genérica para endpoints
  
  
  // Respuesta específica para listar clientes
  export interface ClientesListResponse {
    httpCode: number;
    hasError: boolean;
    message: string;
    result: Cliente[];
  }
  