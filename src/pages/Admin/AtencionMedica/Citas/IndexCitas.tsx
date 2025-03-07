import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    AppBar,
    Toolbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Utils/ConfirmModal";
import GenericFormModal from "../../../Utils/GenericFormModal";
import CustomIconButton from "../../../Utils/CustomIconButton";
import CreateOrUpdateCita from "./CreateOrUpdateCita";
import CitasService from "../../../../services/AtencionMedica/CitasService";
import { RootObject } from "../../../../entities/Seguridad/RootObject";
import { EntCitaEditable } from "../../../../entities/AtencionMedica/EntCitaEditable";

interface IndexCitasProps {
    result: RootObject | null;
}

const IndexCitas: React.FC<IndexCitasProps> = ({ result }) => {
    const parentConfig = result?.Configuracion;
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);
    const [citas, setCitas] = useState<EntCitaEditable[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [selectedCita, setSelectedCita] = useState<EntCitaEditable | null>(null);
    const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const response = await CitasService.obtenerCitas({});
            if (!response.HasError) {
                setCitas(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar las citas.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cita: EntCitaEditable | null = null) => {
        setSelectedCita(
            cita
                ? { ...cita }
                : {
                    Id: "",
                    IdCliente: "",
                    IdSucursal: "",
                    IdServicio: "",
                    IdDoctor: "",
                    FechaCita: "",
                    Estado: "pendiente",
                    Turno: 0,
                    RegistradoEnPiso: false,
                    FechaRegistro: new Date().toISOString(),
                    FechaActualizacion: new Date().toISOString(),
                    Cliente: "",
                    Sucursal: "",
                    Servicio: "",
                    Doctor: "",
                }
        );
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCita(null);
    };

    const handleSaveCita = async () => {
        setLoadingSave(true);
        if (selectedCita) {
            const result = selectedCita.Id
                ? await CitasService.actualizarCita(selectedCita.Id, selectedCita)
                : await CitasService.guardarCita(selectedCita);

            if (result.HasError) {
                toast.error(result.Message || "Error al guardar la cita.");
            } else {
                toast.success(selectedCita.Id ? "Cita actualizada con éxito." : "Cita creada con éxito.");
                handleCloseModal();
                fetchCitas();
            }
        }
        setLoadingSave(false);
    };

    const handleDeleteConfirm = async () => {
        if (handleDelete) {
            await handleDelete();
            setOpenConfirmModal(false);
        }
    };

    const handleDeleteCita = async (id: string): Promise<void> => {
        setHandleDelete(() => async () => {
            const response = await CitasService.cancelarCita(id);
            if (response.HasError) {
                toast.error(response.Message);
            } else {
                toast.success("Cita cancelada con éxito.");
                fetchCitas();
            }
        });
        setOpenConfirmModal(true);
    };

    const handleAtenderCita = async (idCita: string, idSucursal: string) => {
        setLoadingSave(true);
        const response = await CitasService.atenderTurno(idCita, idSucursal);
        if (response.HasError) {
            toast.error(response.Message || "Error al atender la cita.");
        } else {
            toast.success("Cita en proceso.");
            fetchCitas();
        }
        setLoadingSave(false);
    };

    const handleRegistrarLlegada = async (idCita: string) => {
        setLoadingSave(true);
        const response = await CitasService.registrarLlegada(idCita);
        if (response.HasError) {
            toast.error(response.Message || "Error al registrar llegada.");
        } else {
            toast.success("Llegada registrada con éxito.");
            fetchCitas();
        }
        setLoadingSave(false);
    };

    const handleRegistrarSalida = async (idCita: string) => {
        setLoadingSave(true);
        const response = await CitasService.registrarSalida(idCita);
        if (response.HasError) {
            toast.error(response.Message || "Error al registrar salida.");
        } else {
            toast.success("Salida registrada con éxito.");
            fetchCitas();
        }
        setLoadingSave(false);
    };

    const handleReagendarCita = async (idCita: string) => {
        const nuevaFecha = prompt("Ingrese la nueva fecha (YYYY-MM-DD HH:mm):");
        if (nuevaFecha) {
            setLoadingSave(true);
            const response = await CitasService.reagendarCita(idCita, nuevaFecha);
            if (response.HasError) {
                toast.error(response.Message || "Error al reagendar cita.");
            } else {
                toast.success("Cita reagendada con éxito.");
                fetchCitas();
            }
            setLoadingSave(false);
        }
    };


    useEffect(() => {
        fetchCitas();
    }, []);

    return (
        <Box sx={{ width: "100%", backgroundColor: "#f2f2f2", minHeight: "90vh" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Citas
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {result?.PermisosBotones.find((x) => x.ClaveBoton === "add_cita")?.TienePermiso && (
                            <CustomIconButton onClick={() => handleOpenModal(null)} title="Agregar">
                                <AddIcon />
                            </CustomIconButton>
                        )}
                        <CustomIconButton onClick={fetchCitas} title="Refrescar">
                            <RefreshIcon />
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
                                <TableRow sx={{ backgroundColor: parentConfig?.ColorPrimario || "#1976d2" }}>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Cliente</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Sucursal</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Servicio</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Doctor</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Fecha</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Estado</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {citas.map((cita) => (
                                    <TableRow key={cita.Id}>
                                        <TableCell>{cita.Cliente}</TableCell>
                                        <TableCell>{cita.Sucursal}</TableCell>
                                        <TableCell>{cita.Servicio}</TableCell>
                                        <TableCell>{cita.Doctor || "Sin asignar"}</TableCell>
                                        <TableCell>{new Date(cita.FechaCita).toLocaleString()}</TableCell>
                                        <TableCell>{cita.Estado}</TableCell>
                                        <TableCell>
                                            {cita.Estado === "pendiente" && (
                                                <>
                                                    {/* Editar */}
                                                    <IconButton onClick={() => handleOpenModal(cita)} title="Editar" sx={{ color: "blue" }}>
                                                        ✏️
                                                    </IconButton>

                                                    {/* Cancelar */}
                                                    <IconButton onClick={() => handleDeleteCita(cita.Id)} title="Cancelar" sx={{ color: "red" }}>
                                                        ❌
                                                    </IconButton>

                                                    {/* Atender */}
                                                    <IconButton onClick={() => handleAtenderCita(cita.Id, cita.IdSucursal)} title="Atender" sx={{ color: "green" }}>
                                                        ✅
                                                    </IconButton>

                                                    {/* Reagendar */}
                                                    <IconButton onClick={() => handleReagendarCita(cita.Id)} title="Reagendar" sx={{ color: "orange" }}>
                                                        🔄
                                                    </IconButton>
                                                </>
                                            )}

                                            {cita.Estado === "proceso" && (
                                                <>
                                                    {/* Registrar Llegada */}
                                                    <IconButton onClick={() => handleRegistrarLlegada(cita.Id)} title="Registrar Llegada" sx={{ color: "blue" }}>
                                                        🚶
                                                    </IconButton>

                                                    {/* Registrar Salida */}
                                                    <IconButton onClick={() => handleRegistrarSalida(cita.Id)} title="Registrar Salida" sx={{ color: "black" }}>
                                                        🚪
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <GenericFormModal open={openModal} title="Cita" onClose={handleCloseModal} onSubmit={handleSaveCita} isLoading={loadingSave}>
                <CreateOrUpdateCita cita={selectedCita!} setCita={setSelectedCita} onSave={handleSaveCita} />
            </GenericFormModal>

            <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteConfirm} title="Confirmar cancelación" message="¿Estás seguro de que deseas cancelar esta cita?" />
        </Box>
    );
};

export default IndexCitas;
