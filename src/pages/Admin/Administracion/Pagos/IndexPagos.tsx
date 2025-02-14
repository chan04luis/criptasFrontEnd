import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    AppBar,
    Toolbar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    TableFooter,
    TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import { toast } from "react-toastify";
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import CustomIconButton from "../../../Utils/CustomIconButton";
import GenericFilterForm, { FilterField } from "../../../Utils/GenericFilterForm";
import { PagoLista } from "../../../../entities/Administracion/Pagos/PagoLista";
import { PagoFiltros } from "../../../../entities/Administracion/Pagos/PagoFiltros";
import PagosService from "../../../../services/Administracion/PagosService";
import AddPagoForm from "./AddPagoForm";
import ConfirmModal from "../../../Utils/ConfirmModal";
import AplicarPagoForm from "./AplicarPagoForm";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PagoParcialidadModal from "./PagoParcialidadModal";
import { PagoParcialidad } from "../../../../entities/Administracion/Pagos/PagoParcialidad";


interface IndexPagosProps {
    parentConfig: Configuracion | undefined;
}

const IndexPagos: React.FC<IndexPagosProps> = ({ parentConfig }) => {
    const loadFilters = (): PagoFiltros => ({
        Id: "",
        IdCliente: "",
        IdCripta: "",
        IdTipoPago: "",
        Pagado: null,
        Estatus: true,
        NumPag: 1,
        NumReg: 10,
    });
    const [openAddPagoForm, setOpenAddPagoForm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalReg, setTotalReg] = useState<number>(0);
    const [pagos, setPagos] = useState<PagoLista[]>([]);
    //const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [filters, setFilters] = useState<PagoFiltros>(loadFilters);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<PagoLista | null>(null);
    const [openAplicarPago, setOpenAplicarPago] = useState<boolean>(false);
    const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoLista | null>(null);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

    const [openPagoParcialModal, setOpenPagoParcialModal] = useState<boolean>(false);
    const [pagoParcialSeleccionado, setPagoParcialSeleccionado] = useState<PagoLista | null>(null);
    const [pagosParciales, setPagosParciales] = useState<PagoParcialidad[]>([]);

    const filterFields: FilterField<PagoFiltros>[] = [
        { type: "autocomplete", name: "Pagado", label: "Pagado", value: filters.Pagado, options: [{ id: true, label: "Sí" }, { id: false, label: "No" }] },
        { type: "autocomplete", name: "Estatus", label: "Estatus", value: filters.Estatus, options: [{ id: true, label: "Activo" }, { id: false, label: "Inactivo" }] },
    ];

    const handleDeletePago = (pago: PagoLista) => {
        setSelected(pago);
        setOpenConfirmModal(true);
    }

    const addPago = async (pagoData: any) => {
        try {
            const response = await PagosService.createPago(pagoData);
            if (!response.HasError) {
                fetchPagos();
            } else {
                console.error("Error al guardar el pago:", response.Message);
                alert("Error al guardar el pago: " + response.Message);
            }
        } catch (error) {
            console.error("Error en la solicitud de pago:", error);
            alert("Ocurrió un error al guardar el pago.");
        }
    }

    const handleDelete = async () => {
        if (selected) {
            try {
                const result = await PagosService.deletePago(selected.Id);
                if (result.HasError) {
                    toast.error(result.Message || "Error al eliminar el pago.");
                } else {
                    toast.success("Pago eliminado con éxito.");
                    fetchPagos();
                }
            } catch (error) {
                toast.error("Error al eliminar el pago.");
                console.error(error);
            }
        }
        setOpenConfirmModal(false);
    };

    const fetchPagos = async () => {
        setLoading(true);
        try {
            const response = await PagosService.listPago(filters);
            if (!response.HasError) {
                setPagos(response.Result.Items);
                setTotalReg(response.Result.TotalRecords);
            } else {
                setTotalReg(0);
                setPagos([]);
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar los pagos.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        filters.NumPag = page;
        setFilters((prev) => ({ ...prev, NumPag: page }));
        fetchPagos();
    };

    const handlePageSizeChange = (size: number) => {
        filters.NumReg = size;
        setFilters((prev) => ({ ...prev, NumReg: size, NumPag: 1 }));
        fetchPagos();
    };

    const fetchPagosParciales = async (pagoId: string) => {
        try {
            const response = await PagosService.getParcialidadesByPago(pagoId);
            if (!response.HasError) {
                setPagosParciales(response.Result);
                setOpenPagoParcialModal(true);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al obtener los pagos parciales.");
        }
    };

    useEffect(() => {
        fetchPagos();
    }, []);

    return (
        <Box sx={{ width: "100%", backgroundColor: "#f2f2f2", minHeight: "90vh", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Pagos
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <CustomIconButton onClick={() => setOpenAddPagoForm(true)} title="Agregar">
                            <AddIcon />
                        </CustomIconButton>
                        <CustomIconButton onClick={fetchPagos} title="Refrescar">
                            <RefreshIcon />
                        </CustomIconButton>
                        <CustomIconButton onClick={() => setIsDrawerOpen(true)} title="Filtros">
                            <FilterListIcon />
                        </CustomIconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Paper elevation={3} sx={{ margin: 2, padding: 2 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Iglesia</TableCell>
                                    <TableCell>Zona</TableCell>
                                    <TableCell>Sección</TableCell>
                                    <TableCell>Cripta</TableCell>
                                    <TableCell>Monto Total</TableCell>
                                    <TableCell>Monto Pagado</TableCell>
                                    <TableCell>Pagado</TableCell>
                                    <TableCell>Fecha Límite<br />o de Pago</TableCell>
                                    <TableCell>Estatus</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagos.map((pago) => (
                                    <TableRow key={pago.Id}>
                                        <TableCell>{pago.NombreCliente} {pago.ApellidosCliente}</TableCell>
                                        <TableCell>{pago.NombreIglesia}</TableCell>
                                        <TableCell>{pago.NombreZona}</TableCell>
                                        <TableCell>{pago.NombreSeccion}</TableCell>
                                        <TableCell>{pago.NumeroCripta}</TableCell>
                                        <TableCell>${pago.MontoTotal.toFixed(2)}</TableCell>
                                        <TableCell>${pago.MontoPagado.toFixed(2)}</TableCell>
                                        <TableCell>{pago.Pagado ? "Sí" : "No"}</TableCell>
                                        <TableCell>{pago.Pagado ? new Date(pago.FechaPagado).toLocaleDateString() : new Date(pago.FechaLimite).toLocaleDateString()}</TableCell>
                                        <TableCell>{pago.Estatus ? "Activo" : "Inactivo"}</TableCell>
                                        <TableCell>
                                            {pago.ClavePago != "PUE" && (
                                                <IconButton
                                                    title="Ver Detalle de Pagos"
                                                    color="secondary"
                                                    onClick={() => {
                                                        setPagoSeleccionado(pago);
                                                        setPagoParcialSeleccionado(pago);
                                                        fetchPagosParciales(pago.Id);
                                                    }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            )}
                                            {!pago.Pagado && (
                                                <>
                                                    <IconButton title="Editar">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton title="Eliminar" sx={{ color: "red" }} onClick={() => handleDeletePago(pago)}>
                                                        <DeleteForeverIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        title="Aplicar Pago"
                                                        color="primary"
                                                        onClick={() => {
                                                            setPagoSeleccionado(pago);
                                                            setOpenAplicarPago(true);
                                                        }}
                                                    >
                                                        <AttachMoneyIcon />
                                                    </IconButton>
                                                </>

                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Box display="flex" justifyContent="center">
                                            <TablePagination
                                                component="div"
                                                count={totalReg}
                                                page={filters.NumPag - 1}
                                                onPageChange={(_, newPage) => handlePageChange(newPage + 1)}
                                                rowsPerPage={filters.NumReg}
                                                onRowsPerPageChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
                                                rowsPerPageOptions={[10, 20, 50, 100]}
                                                labelRowsPerPage="Registros por página:"
                                                labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                                            />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <PagoParcialidadModal
                pago={pagoSeleccionado}
                setPagoSeleccionado={setPagoSeleccionado}
                open={openPagoParcialModal}
                onClose={() => setOpenPagoParcialModal(false)}
                pagosParciales={pagosParciales}
                reloadPagosParciales={() => fetchPagosParciales(pagoParcialSeleccionado?.Id || "")}
            />

            <AplicarPagoForm
                open={openAplicarPago}
                onClose={() => setOpenAplicarPago(false)}
                pago={pagoSeleccionado}
                onSuccess={fetchPagos}
            />

            <GenericFilterForm filters={filters} setFilters={setFilters} onSearch={fetchPagos} isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} fields={filterFields} />

            <AddPagoForm
                open={openAddPagoForm}
                onClose={() => setOpenAddPagoForm(false)}
                onSave={addPago}
            />

            <ConfirmModal
                open={openConfirmModal}
                onClose={() => setOpenConfirmModal(false)}
                onConfirm={handleDelete}
                title="Confirmar eliminación"
                message="¿Estás seguro de que deseas eliminar este pago?"
            />

        </Box>
    );
};

export default IndexPagos;
