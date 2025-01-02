export interface PaginatedResponse<T> {
    datos: T[]; // Lista de elementos
    totalRegistros: number; // Total de elementos
    pagina: number; // Página actual
  }
  