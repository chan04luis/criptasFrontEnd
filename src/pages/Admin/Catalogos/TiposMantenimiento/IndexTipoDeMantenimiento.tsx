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
import CreateOrUpdateTipoDeMantenimiento from "./CreateOrUpdateTipoDeMantenimiento";
import { EntTipoDeMantenimiento } from "../../../../entities/catalogos/tipo_mantenimientos/EntTipoDeMantenimiento";
import TipoDeMantenimientoService from "../../../../services/Catalogos/TipoDeMantenimientoService";

interface IndexTipoDeMantenimientoProps {
    parentConfig: Configuracion | undefined;
}

const IndexTipoDeMantenimiento: React.FC<IndexTipoDeMantenimientoProps> = ({ parentConfig }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [mantenimientos, setMantenimientos] = useState<EntTipoDeMantenimiento[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [selectedMantenimiento, setSelectedMantenimiento] = useState<EntTipoDeMantenimiento | null>(null);
    const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);

    const fetchMantenimientos = async () => {
        setLoading(true);
        try {
            const response = await TipoDeMantenimientoService.get();
            if (!response.HasError) {
                setMantenimientos(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar los tipos de mantenimiento.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mantenimiento: EntTipoDeMantenimiento | null = null) => {
        if (mantenimiento) {
            setSelectedMantenimiento({ ...mantenimiento });
        } else {
            setSelectedMantenimiento({
                Id: "",
                Nombre: "",
                Descripcion: "",
                Costo: 0,
                Estatus: true,
                Img: "",
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedMantenimiento(null);
    };

    const handleSaveMantenimiento = async () => {
        console.log(selectedMantenimiento);
        if (selectedMantenimiento) {
            if (selectedMantenimiento.Id && selectedMantenimiento.Id != '') {
                const result = await TipoDeMantenimientoService.update(selectedMantenimiento);
                if (result.HasError) {
                    toast.error(result.Message || "Error al actualizar.");
                } else {
                    toast.success("Actualizado con éxito.");
                }
            } else {
                const result = await TipoDeMantenimientoService.create(selectedMantenimiento);
                if (result.HasError) {
                    toast.error(result.Message || "Error al crear.");
                } else {
                    toast.success("Creado con éxito.");
                }
            }
        }
        handleCloseModal();
        fetchMantenimientos();
    };

    const handleDeleteConfirm = async () => {
        if (handleDelete) {
            await handleDelete();
            setOpenConfirmModal(false);
        }
    };

    const handleDeleteMantenimiento = async (id: string): Promise<void> => {
        setHandleDelete(() => async () => {
            const response = await TipoDeMantenimientoService.delete(id);
            if (response.HasError) {
                toast.error(response.Message);
            } else {
                toast.success("Eliminado con éxito.");
                fetchMantenimientos();
            }
        });
        setOpenConfirmModal(true);
    };

    useEffect(() => {
        fetchMantenimientos();
    }, []);

    return (
        <Box sx={{ width: "100%", backgroundColor: "#f2f2f2", minHeight: "90vh" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Tipos de Mantenimiento
                    </Typography>
                    <IconButton onClick={() => handleOpenModal(null)} title="Agregar">
                        <AddIcon />
                    </IconButton>
                    <IconButton onClick={fetchMantenimientos} title="Refrescar">
                        <RefreshIcon />
                    </IconButton>
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
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Descripción</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Costo</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Imagen</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mantenimientos.map((mantenimiento) => (
                                    <TableRow key={mantenimiento.Id}>
                                        <TableCell>{mantenimiento.Nombre}</TableCell>
                                        <TableCell>{mantenimiento.Descripcion}</TableCell>
                                        <TableCell>${mantenimiento.Costo.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {mantenimiento.Img ? (
                                                <img src={mantenimiento.Img} alt="Imagen" style={{ width: 50, height: 50, borderRadius: 5 }} />
                                            ) : (
                                                "Sin imagen"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenModal(mantenimiento)} title="Editar">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteMantenimiento(mantenimiento.Id)} title="Eliminar" sx={{ color: "red" }}>
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

            <GenericFormModal open={openModal} title="Tipo de Mantenimiento" onClose={handleCloseModal} onSubmit={handleSaveMantenimiento} isLoading={loading}>
                <CreateOrUpdateTipoDeMantenimiento mantenimiento={selectedMantenimiento!} setMantenimiento={setSelectedMantenimiento} onSave={handleSaveMantenimiento} />
            </GenericFormModal>

            <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteConfirm} title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar este mantenimiento?" />
        </Box>
    );
};

export default IndexTipoDeMantenimiento;
