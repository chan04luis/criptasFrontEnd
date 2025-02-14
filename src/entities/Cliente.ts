export interface Cliente {
  Id: string;
  Nombres: string;
  Apellidos: string;
  Direccion: string;
  FechaNac: string;
  Sexo: string;
  Edad: number;
  Origen: number;
  Contra: string;
  Telefono: string;
  Email: string;
  FechaRegistro: string;
  FechaActualizacion: string;
  Estatus: boolean;
}

export interface ClienteCreatePayload {
  Nombres: string;
  Apellidos: string;
  Direccion: string;
  FechaNac: string;
  FechaNacD: Date,
  Sexo: string;
  Telefono: string;
  Email: string;
}

export interface ClienteUpdatePayload {
  Id: string;
  Nombres?: string;
  Apellidos?: string;
  Direccion?: string;
  FechaNac?: string;
  Sexo?: string;
  Telefono?: string;
  Email?: string;
}

export interface ClienteUpdateStatusPayload {
  Id: string;
  Estatus: boolean;
}

export interface ClientesListResponse {
  httpCode: number;
  hasError: boolean;
  message: string;
  result: Cliente[];
}

export interface ClienteFilters {
  Id: string;
  Nombre: string;
  Apellido: string;
  Correo: string;
  Estatus: boolean;
  NumPag: number;
  NumReg: number;
}
