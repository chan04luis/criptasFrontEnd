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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Utils/ConfirmModal";
import GenericFormModal from "../../../Utils/GenericFormModal";
import CreateOrUpdateServicio from "./CreateOrUpdateServicio";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CustomIconButton from "../../../Utils/CustomIconButton";
import { RootObject } from "../../../../entities/Seguridad/RootObject";
import { EntServicios } from "../../../../entities/Catalogos/servicios/EntServicios";
import ServiciosService from "../../../../services/Catalogo/ServiciosService";

interface IndexServiciosProps {
    result: RootObject | null;
}

const IndexServicios: React.FC<IndexServiciosProps> = ({ result }) => {
    var parentConfig = result?.Configuracion;
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);
    const [servicios, setServicios] = useState<EntServicios[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [selectedServicio, setSelectedServicio] = useState<EntServicios | null>(null);
    const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);

    const fetchServicios = async () => {
        setLoading(true);
        try {
            const response = await ServiciosService.getList();
            if (!response.HasError) {
                setServicios(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar los servicios.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (servicio: EntServicios | null = null) => {
        setSelectedServicio(
            servicio
                ? {
                    ...servicio,
                    Img: servicio.Img ?? "",
                    ImgPreview: servicio.ImgPreview ?? "",
                    FechaRegistro: servicio.FechaRegistro ?? new Date().toISOString(),
                    FechaActualizacion: new Date().toISOString(),
                }
                : {
                    Id: "",
                    Nombre: "",
                    Descripcion: "",
                    Estatus: true,
                    Img: "",
                    ImgPreview: "",
                    FechaRegistro: new Date().toISOString(),
                    FechaActualizacion: new Date().toISOString(),
                }
        );
        setOpenModal(true);
    };

    const handleUpdateStatus = async (item: EntServicios) => {
        try {
            item.Estatus = !item.Estatus;
            const response = await ServiciosService.updateStatus(item.Id, item.Estatus);
            if (response.HasError) {
                toast.error(response.Message);
            } else {
                toast.success("Estatus actualizado con éxito.");
                fetchServicios();
            }
        } catch (error) {
            toast.error("Error al actualizar el estatus.");
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedServicio(null);
    };

    const handleSaveServicio = async () => {
        setLoadingSave(true);
        if (selectedServicio) {
            const result = selectedServicio.Id
                ? await ServiciosService.update(selectedServicio)
                : await ServiciosService.create(selectedServicio);

            if (result.HasError) {
                toast.error(result.Message || "Error al guardar el servicio.");
            } else {
                toast.success(selectedServicio.Id ? "Servicio actualizado con éxito." : "Servicio creado con éxito.");
                handleCloseModal();
                fetchServicios();
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

    const handleDeleteServicio = async (id: string): Promise<void> => {
        setHandleDelete(() => async () => {
            const response = await ServiciosService.delete(id);
            if (response.HasError) {
                toast.error(response.Message);
            } else {
                toast.success("Servicio eliminado con éxito.");
                fetchServicios();
            }
        });
        setOpenConfirmModal(true);
    };


    useEffect(() => {
        fetchServicios();
    }, []);

    return (
        <Box sx={{ width: "100%", backgroundColor: "#f2f2f2", minHeight: "90vh" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Servicios
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {result?.PermisosBotones.find(x => x.ClaveBoton == 'add_service')?.TienePermiso && <CustomIconButton onClick={() => handleOpenModal(null)} title="Agregar">
                                <AddIcon />
                            </CustomIconButton>}
                            <CustomIconButton onClick={fetchServicios} title="Refrescar">
                                <RefreshIcon />
                            </CustomIconButton>
                        </Box>
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
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Nombre</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Imagen</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Estatus</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {servicios.map((servicio) => (
                                    <TableRow key={servicio.Id}>
                                        <TableCell>{servicio.Nombre}</TableCell>

                                        <TableCell>
                                            {servicio.ImgPreview ? (
                                                <img src={servicio.ImgPreview ?? undefined} alt="Imagen" style={{ width: 50, height: 50, borderRadius: 5 }} />
                                            ) : (
                                                "Sin imagen"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {result?.PermisosBotones.find(x => x.ClaveBoton == 'status_service')?.TienePermiso ? <IconButton
                                                onClick={() => handleUpdateStatus(servicio)}
                                                title={servicio.Estatus ? "Deshabilitar" : "Habilitar"}
                                                sx={{ color: servicio.Estatus ? "green" : "gray" }}
                                            >
                                                {servicio.Estatus ? <ToggleOnIcon /> : <ToggleOffIcon />}
                                            </IconButton> : servicio.Estatus ? <ToggleOnIcon sx={{ color: "green" }} /> : <ToggleOffIcon sx={{ color: "gray" }} />}
                                        </TableCell>
                                        <TableCell>
                                            {result?.PermisosBotones.find(x => x.ClaveBoton == 'edit_service')?.TienePermiso && <IconButton onClick={() => handleOpenModal(servicio)} title="Editar">
                                                <EditIcon />
                                            </IconButton>}
                                            {result?.PermisosBotones.find(x => x.ClaveBoton == 'delete_service')?.TienePermiso && <IconButton onClick={() => handleDeleteServicio(servicio.Id)} title="Eliminar" sx={{ color: "red" }}>
                                                <DeleteForeverIcon />
                                            </IconButton>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <GenericFormModal open={openModal} title="Servicio" onClose={handleCloseModal} onSubmit={handleSaveServicio} isLoading={loadingSave}>
                <CreateOrUpdateServicio servicio={selectedServicio!} setServicio={setSelectedServicio} onSave={handleSaveServicio} />
            </GenericFormModal>

            <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteConfirm} title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar este servicio?" />
        </Box>
    );
};

export default IndexServicios;
