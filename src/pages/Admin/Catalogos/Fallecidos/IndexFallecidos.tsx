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
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import ConfirmModal from "../../../Utils/ConfirmModal";
import GenericFormModal from "../../../Utils/GenericFormModal";
import CreateFallecido from "./CreateFallecido";
import UpdateFallecido from "./UpdateFallecido";
import { EntFallecidos } from "../../../../entities/catalogos/fallecidos/EntFallecidos";
import { EntFallecidosRequest } from "../../../../entities/catalogos/fallecidos/EntFallecidosRequest";
import { EntFallecidosUpdateRequest } from "../../../../entities/catalogos/fallecidos/EntFallecidosUpdateRequest";
import FallecidosService from "../../../../services/Catalogos/FallecidosService";
import CustomIconButton from "../../../Utils/CustomIconButton";

interface IndexFallecidosProps {
    parentConfig: Configuracion | undefined;
    uIdCripta: string;
}

const IndexFallecidos: React.FC<IndexFallecidosProps> = ({ parentConfig, uIdCripta }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [fallecidos, setFallecidos] = useState<EntFallecidos[]>([]);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [selectedFallecido, setSelectedFallecido] = useState<EntFallecidos | null>(null);
    const [newFallecido, setNewFallecido] = useState<EntFallecidosRequest>({
        Nombre: "",
        Apellidos: "",
        Nacimiento: "",
        Fallecimiento: "",
        IdCripta: uIdCripta,
    });
    const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);

    const fetchFallecidos = async () => {
        if (!uIdCripta) return;
        setLoading(true);
        try {
            const response = await FallecidosService.getById(uIdCripta);
            if (!response.HasError) {
                setFallecidos(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar los fallecidos.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setNewFallecido({
            Nombre: "",
            Apellidos: "",
            Nacimiento: "",
            Fallecimiento: "",
            IdCripta: uIdCripta,
        });
        setOpenCreateModal(true);
    };

    const handleOpenUpdateModal = (fallecido: EntFallecidos) => {
        setSelectedFallecido(fallecido);
        setOpenUpdateModal(true);
    };

    const handleCloseModals = () => {
        setOpenCreateModal(false);
        setOpenUpdateModal(false);
        setSelectedFallecido(null);
    };

    const handleSaveFallecido = async () => {
        if (selectedFallecido) {
            const updatePayload: EntFallecidosUpdateRequest = {
                Id: selectedFallecido.Id,
                Nombre: selectedFallecido.Nombre,
                Apellidos: selectedFallecido.Apellidos,
                Nacimiento: selectedFallecido.Nacimiento,
                Fallecimiento: selectedFallecido.Fallecimiento,
                IdCripta: uIdCripta,
            };
            const result = await FallecidosService.update(updatePayload);
            if (result.HasError) {
                toast.error(result.Message || "Error al actualizar.");
            } else {
                toast.success("Actualizado con éxito.");
            }
        } else {
            const result = await FallecidosService.create(newFallecido);
            if (result.HasError) {
                toast.error(result.Message || "Error al crear.");
            } else {
                toast.success("Creado con éxito.");
            }
        }
        handleCloseModals();
        fetchFallecidos();
    };

    const handleDeleteConfirm = async () => {
        if (handleDelete) {
            await handleDelete();
            setOpenConfirmModal(false);
        }
    };

    const handleDeleteFallecido = async (id: string): Promise<void> => {
        setHandleDelete(() => async () => {
            const response = await FallecidosService.delete(id);
            if (response.HasError) {
                toast.error(response.Message);
            } else {
                toast.success("Eliminado con éxito.");
                fetchFallecidos();
            }
        });
        setOpenConfirmModal(true);
    };
    const s = (edad: number) => {
        return edad > 1 ? 's' : '';
    }

    useEffect(() => {
        fetchFallecidos();
    }, []);

    return (
        <Box sx={{ width: "100%", backgroundColor: "#f2f2f2", minHeight: "90vh" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Fallecidos
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <CustomIconButton onClick={handleOpenCreateModal} title="Agregar">
                            <AddIcon />
                        </CustomIconButton>
                        <CustomIconButton onClick={fetchFallecidos} title="Refrescar">
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
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Nombre</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Apellidos</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Edad</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Fecha Nacimiento</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Fecha Fallecimiento</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fallecidos.map((fallecido) => (
                                    <TableRow key={fallecido.Id}>
                                        <TableCell>{fallecido.Nombre}</TableCell>
                                        <TableCell>{fallecido.Apellidos}</TableCell>
                                        <TableCell>{`${fallecido.Edad} año${s(fallecido.Edad)}`}</TableCell>
                                        <TableCell>{new Date(fallecido.Nacimiento).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(fallecido.Fallecimiento).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenUpdateModal(fallecido)} title="Editar">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteFallecido(fallecido.Id)} title="Eliminar" sx={{ color: "red" }}>
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <GenericFormModal open={openCreateModal} title="Crear Fallecido" onClose={handleCloseModals} onSubmit={handleSaveFallecido} isLoading={loading}>
                <CreateFallecido fallecido={newFallecido} setFallecido={setNewFallecido} onSave={handleSaveFallecido} />
            </GenericFormModal>

            <GenericFormModal open={openUpdateModal} title="Actualizar Fallecido" onClose={handleCloseModals} onSubmit={handleSaveFallecido} isLoading={loading}>
                <UpdateFallecido
                    fallecido={selectedFallecido!}
                    setFallecido={(data) => setSelectedFallecido((prev) => ({
                        ...(prev as EntFallecidos),
                        ...data,
                        Estatus: prev?.Estatus ?? true,
                        FechaRegistro: prev?.FechaRegistro ?? new Date().toISOString(),
                        FechaActualizacion: new Date().toISOString()
                    }))}
                    onSave={handleSaveFallecido}
                />
            </GenericFormModal>

            <ConfirmModal
                open={openConfirmModal}
                onClose={() => setOpenConfirmModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Confirmar eliminación"
                message="¿Estás seguro de que deseas eliminar este fallecido?"
            />

        </Box>
    );
};

export default IndexFallecidos;
