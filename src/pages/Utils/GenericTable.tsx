import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import BusinessIcon from "@mui/icons-material/Business";

export interface Column<T> {
  field: keyof T;
  headerName: string;
  sortable?: boolean;
  renderCell?: (value: any, row: T) => React.ReactNode;
  filterable?: boolean;
}

interface GenericTableProps<T> {
  data: T[] | null | undefined;
  columns: Column<T>[];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  filters: Partial<Record<keyof T, string>>;
  onFiltersChange: (filters: Partial<Record<keyof T, string>>) => void;
  onSortChange: (field: keyof T, order: "asc" | "desc") => void;
  sortField?: keyof T;
  sortOrder?: "asc" | "desc";
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onAsiggment?: (id: string) => void;
  onAsiggmentSuc?: (id: string) => void;
  onUpdateStatus?: (id: string, currentStatus: string) => void;
  statusField?: keyof T;
  keyField: keyof T; // Propiedad dinámica para clave única
}

const GenericTable = <T extends Record<string, any>>({
  data,
  columns,
  totalRecords,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  filters,
  onFiltersChange,
  onSortChange,
  sortField,
  sortOrder,
  onEdit,
  onDelete,
  onAsiggment,
  onAsiggmentSuc,
  onUpdateStatus,
  statusField,
  keyField,
}: GenericTableProps<T>) => {
  const handleColumnSort = (field: keyof T) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    onSortChange(field, order);
  };

  const renderSortIcon = (field: keyof T) => {
    if (sortField === field) {
      return sortOrder === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    }
    return null;
  };

  return (
    <Box sx={{ marginTop: 4, marginX: 2, backgroundColor: "#fff" }}>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.field)} align="center">
                  <Box display="flex" flexDirection="column">
                    {col.sortable ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => handleColumnSort(col.field)}
                        style={{ cursor: "pointer" }}
                      >
                        <span>{col.headerName}</span>
                        {renderSortIcon(col.field)}
                      </Box>
                    ) : <span>{col.headerName}</span>}
                    {col.filterable && (
                      <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Buscar"
                        value={filters[col.field] || ""}
                        onChange={(e) => onFiltersChange({ ...filters, [col.field]: e.target.value })}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
              ))}
              {(onEdit || onDelete || onUpdateStatus) && (
                <TableCell align="center">Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={String(row[keyField])}>
                {columns.map((col) => (
                  <TableCell key={String(col.field)} align="center">
                    {col.renderCell ? col.renderCell(row[col.field], row) : String(row[col.field]) || ""}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onUpdateStatus) && (
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      {onEdit && (
                        <Tooltip title="Editar">
                          <IconButton onClick={() => onEdit(row)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => onDelete(String(row[keyField]))}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onAsiggment && (
                        <Tooltip title="Asignar Servicios">
                          <IconButton onClick={() => onAsiggment(String(row[keyField]))}>
                            <PlaylistAddIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onAsiggmentSuc && (
                        <Tooltip title="Asignar Sucursales">
                          <IconButton onClick={() => onAsiggmentSuc(String(row[keyField]))}>
                            <BusinessIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onUpdateStatus && statusField && row[statusField] !== undefined && (
                        <Tooltip
                          title={
                            row[statusField] === "Activo" ? "Desactivar" : "Activar"
                          }
                        >
                          <IconButton
                            onClick={() =>
                              onUpdateStatus(String(row[keyField]), String(row[statusField]))
                            }
                          >
                            {row[statusField] === "Activo" ? (
                              <ToggleOffIcon color="action" />
                            ) : (
                              <ToggleOnIcon color="success" />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {(!data || data.length === 0) && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length + (onEdit || onDelete || onUpdateStatus ? 1 : 0)}>
                <Box display="flex" justifyContent="center">
                  <TablePagination
                    component="div"
                    count={totalRecords}
                    page={currentPage - 1}
                    onPageChange={(_, newPage) => onPageChange(newPage + 1)}
                    rowsPerPage={pageSize}
                    onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    labelRowsPerPage="Registros por página:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                  />
                </Box>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Box>
    </Box>
  );
};

export default GenericTable;
