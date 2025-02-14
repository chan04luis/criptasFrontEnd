import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
} from "@mui/material";
import ClienteService from "../../../../services/Catalogos/ClienteService";
import { Cliente, ClienteFilters } from "../../../../entities/Cliente";
import SearchIcon from "@mui/icons-material/Search";

interface ClienteSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (cliente: Cliente) => void;
}

const ClienteSelectionModal: React.FC<ClienteSelectionModalProps> = ({
    open,
    onClose,
    onSelect,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [totalReg, setTotalReg] = useState<number>(0);
    const [filters, setFilters] = useState<ClienteFilters>({
        Id: "",
        Nombre: "",
        Apellido: "",
        Correo: "",
        Estatus: true,
        NumPag: 1,
        NumReg: 10,
    });

    // Nuevo estado temporal para evitar búsquedas automáticas
    const [tempFilters, setTempFilters] = useState<ClienteFilters>({ ...filters });

    const fetchClientes = async () => {
        setLoading(true);
        try {
            const response = await ClienteService.getClientesByFilters(filters);
            if (!response.HasError) {
                setClientes(response.Result.Items || []);
                setTotalReg(response.Result.TotalRecords);
            } else {
                setClientes([]);
            }
        } catch (error) {
            console.error("Error al obtener clientes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchClientes();
    }, [open, filters.NumPag, filters.NumReg]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Seleccionar Cliente</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                    <TextField
                        label="Nombre"
                        variant="outlined"
                        fullWidth
                        value={tempFilters.Nombre}
                        onChange={(e) => setTempFilters({ ...tempFilters, Nombre: e.target.value })}
                    />
                    <TextField
                        label="Apellido"
                        variant="outlined"
                        fullWidth
                        value={tempFilters.Apellido}
                        onChange={(e) => setTempFilters({ ...tempFilters, Apellido: e.target.value })}
                    />
                    <TextField
                        label="Correo"
                        variant="outlined"
                        fullWidth
                        value={tempFilters.Correo}
                        onChange={(e) => setTempFilters({ ...tempFilters, Correo: e.target.value })}
                    />
                    <IconButton color="primary"
                        onClick={() => {
                            filters.Nombre = tempFilters.Nombre;
                            filters.Apellido = tempFilters.Apellido;
                            filters.Correo = tempFilters.Correo;
                            setFilters({ ...filters, Correo: tempFilters.Correo, Nombre: tempFilters.Nombre, Apellido: tempFilters.Apellido });
                            fetchClientes(); // Ejecutar búsqueda manualmente
                        }}
                        disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                    </IconButton>
                </Box>

                <Paper elevation={3} sx={{ marginTop: 2 }}>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Correo</TableCell>
                                        <TableCell>Teléfono</TableCell>
                                        <TableCell>Seleccionar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clientes.map((cliente) => (
                                        <TableRow key={cliente.Id}>
                                            <TableCell>{`${cliente.Nombres} ${cliente.Apellidos}`}</TableCell>
                                            <TableCell>{cliente.Email}</TableCell>
                                            <TableCell>{cliente.Telefono}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => onSelect(cliente)}>
                                                    Seleccionar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            count={totalReg}
                                            page={filters.NumPag - 1}
                                            onPageChange={(_, newPage) => setFilters({ ...filters, NumPag: newPage + 1 })}
                                            rowsPerPage={filters.NumReg}
                                            onRowsPerPageChange={(e) => setFilters({ ...filters, NumReg: parseInt(e.target.value, 10), NumPag: 1 })}
                                            rowsPerPageOptions={[10, 20, 50, 100]}
                                            labelRowsPerPage="Registros por página:"
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClienteSelectionModal;
