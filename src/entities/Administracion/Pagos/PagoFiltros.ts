export interface PagoFiltros {
  Id: string;
  IdCliente: string;
  IdCripta: string;
  IdTipoPago: string;
  Pagado: boolean | null;
  Estatus: boolean;
  NumPag: number;
  NumReg: number;
}