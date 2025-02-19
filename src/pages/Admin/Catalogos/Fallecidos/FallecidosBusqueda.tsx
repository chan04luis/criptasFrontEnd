import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    AppBar,
    Toolbar,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TableFooter,
    TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { FallecidosBusqueda } from "../../../../entities/catalogos/fallecidos/FallecidosBusqueda";
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import FallecidosService from "../../../../services/Catalogos/FallecidosService";
import IglesiaService from "../../../../services/Catalogos/IglesiaService";
import { Iglesia } from "../../../../entities/catalogos/iglesias/Iglesia";
import { EntFallecidosSearchRequest } from "../../../../entities/catalogos/fallecidos/EntFallecidosSearchRequest";
import GenericFormModal from "../../../Utils/GenericFormModal";
import VisitaFallecido from "./VisitaFallecido";
import { Visita } from "../../../../entities/catalogos/fallecidos/visita";
import CriptasService from "../../../../services/Catalogos/CriptasService";

interface FallecidosBusquedaProps {
    parentConfig: Configuracion | undefined;
}

const FallecidosBusquedaPage: React.FC<FallecidosBusquedaProps> = ({ parentConfig }) => {
    const [busqueda, setBusqueda] = useState<EntFallecidosSearchRequest>({
        Nombre: "",
        Apellidos: "",
        IdIglesia: "",
        Estatus: null,
        NumPag: 1,
        NumReg: 10
    });
    const [visita, setVisita] = useState<Visita>({
        Id: null,
        NombreVisitante: "",
        Mensaje: "",
        IdCriptas: "",
        FechaRegistro: "",
        FechaActualizacion: "",
        Estatus: true
    });

    const [totalReg, setTotalReg] = useState<number>(0);
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(true);
    const [resultados, setResultados] = useState<FallecidosBusqueda[]>([]);
    const [iglesias, setIglesias] = useState<Iglesia[]>([]);

    const handleCloseModals = () => {
        setOpenCreateModal(false);
    }
    const handleOpenModals = (item: FallecidosBusqueda) => {
        setOpenCreateModal(true);
        setVisita({ ...visita, NombreVisitante: "", Mensaje: "", IdCriptas: item.Id });
    }
    const fetchIglesias = async () => {
        setLoading(true);
        try {
            const response = await IglesiaService.getIglesias();
            if (!response.HasError) {
                setIglesias(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar las iglesias.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await FallecidosService.getFallecidos(busqueda);
            if (!response.HasError) {
                setResultados(response.Result.Items);
                setTotalReg(response.Result.TotalRecords);
            } else {
                toast.warn(response.Message);
                setResultados([]);
                setTotalReg(0);
            }
        } catch (error) {
            toast.error("Error al buscar fallecidos.");
            setResultados([]);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    }

    const onPageChange = (page: number) => {
        busqueda.NumPag = page;
        setBusqueda((busqueda) => ({
            ...busqueda,
            NumPag: page,
        }));
        handleSearch();
    };
    const onPageSizeChange = (size: number) => {
        busqueda.NumReg = size;
        setBusqueda((busqueda) => ({
            ...busqueda,
            NumReg: size,
            NumPag: 1,
        }));
        handleSearch();
    };

    const handleSave = async () => {
        setLoadingCreate(true);
        const response = await CriptasService.createVisita(visita);
        if (response.HasError) {
            toast.warn(response.Message);
        } else {
            setOpenCreateModal(false);
            toast.success("Visita registrada")
        }
        setLoadingCreate(false);
    }

    useEffect(() => {
        if (open) {
            fetchIglesias();
        }
    }, [open]);

    return (
        <Box sx={{ width: "100%", padding: 2, backgroundColor: "#f2f2f2", minHeight: "90vh" }}>
            {/* Encabezado */}
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Búsqueda de Fallecidos
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Barra de búsqueda */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 2, marginTop: 2, p: 2, background: "#ffffff" }}>
                <FormControl sx={{ width: "150px" }}>
                    <InputLabel>Iglesia</InputLabel>
                    <Select
                        value={busqueda.IdIglesia}
                        onChange={(e) => {
                            setBusqueda({ ...busqueda, IdIglesia: e.target.value });
                        }}
                    >
                        <MenuItem key="all" value="">
                            Todos
                        </MenuItem>

                        {iglesias.map((iglesia) => (
                            <MenuItem key={iglesia.Id} value={iglesia.Id}>
                                {iglesia.Nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Nombres"
                    name="Nombre"
                    variant="outlined"
                    size="small"
                    value={busqueda.Nombre}
                    onChange={handleChange}
                />
                <TextField
                    label="Apellidos"
                    name="Apellidos"
                    variant="outlined"
                    size="small"
                    value={busqueda.Apellidos}
                    onChange={handleChange}
                />
                <IconButton onClick={handleSearch} disabled={loading} color="primary">
                    {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                </IconButton>
            </Box>

            {/* Tabla de resultados */}
            <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: parentConfig?.ColorPrimario || "#1976d2" }}>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Nombre</TableCell>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Apellidos</TableCell>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Edad</TableCell>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Fecha Nacimiento</TableCell>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Fecha Fallecimiento</TableCell>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Cripta</TableCell>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Sección</TableCell>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Zona</TableCell>
                                <TableCell sx={{ color: parentConfig?.ContrastePrimario || "white" }}>Iglesia</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resultados.length > 0 ? (
                                resultados.map((fallecido) => (
                                    <TableRow key={fallecido.Id} title="Agregar visita" sx={{ cursor: "pointer" }} onClick={() => handleOpenModals(fallecido)}>
                                        <TableCell>{fallecido.Nombres}</TableCell>
                                        <TableCell>{fallecido.Apellidos}</TableCell>
                                        <TableCell>{fallecido.Edad}</TableCell>
                                        <TableCell>{fallecido.Nacido}</TableCell>
                                        <TableCell>{fallecido.Fallecido}</TableCell>
                                        <TableCell>{fallecido.Cripta}</TableCell>
                                        <TableCell>{fallecido.Seccion}</TableCell>
                                        <TableCell>{fallecido.Zona}</TableCell>
                                        <TableCell>{fallecido.Iglesia}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} sx={{ textAlign: "center" }}>
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Box display="flex" justifyContent="center">
                                        <TablePagination
                                            component="div"
                                            count={totalReg}
                                            page={busqueda.NumPag - 1}
                                            onPageChange={(_, newPage) => onPageChange(newPage + 1)}
                                            rowsPerPage={busqueda.NumReg}
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
                </TableContainer>
            </Paper>
            <GenericFormModal open={openCreateModal} title="Agregar Visita" onClose={handleCloseModals} onSubmit={handleSave} isLoading={loadingCreate}>
                <VisitaFallecido visita={visita} setVisita={setVisita} onSave={handleSave} />
            </GenericFormModal>
        </Box>
    );
};

export default FallecidosBusquedaPage;
