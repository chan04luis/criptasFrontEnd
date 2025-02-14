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
import CreateBeneficiario from "./CreateBeneficiario";
import UpdateBeneficiario from "./UpdateBeneficiario";
import { EntBeneficiarios } from "../../../../entities/catalogos/beneficiarios/EntBeneficiarios";
import { EntBeneficiariosRequest } from "../../../../entities/catalogos/beneficiarios/EntBeneficiariosRequest";
import BeneficiariosService from "../../../../services/Catalogos/BeneficiariosService";
import CustomIconButton from "../../../Utils/CustomIconButton";

interface IndexBeneficiariosProps {
    parentConfig: Configuracion | undefined;
    uIdCripta: string;
}

const IndexBeneficiarios: React.FC<IndexBeneficiariosProps> = ({ parentConfig, uIdCripta }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [beneficiarios, setBeneficiarios] = useState<EntBeneficiarios[]>([]);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [selectedBeneficiario, setSelectedBeneficiario] = useState<EntBeneficiarios | null>(null);
    const [newBeneficiario, setNewBeneficiario] = useState<EntBeneficiariosRequest>({
        IdCripta: uIdCripta,
        Nombre: "",
        IneFrente: "",
        IneReverso: "",
    });
    const [beneficiarioToDelete, setBeneficiarioToDelete] = useState<string | null>(null);


    const fetchBeneficiarios = async () => {
        if (!uIdCripta) return;
        setLoading(true);
        try {
            const response = await BeneficiariosService.getById(uIdCripta);
            if (!response.HasError) {
                setBeneficiarios(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar los beneficiarios.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setNewBeneficiario({
            IdCripta: uIdCripta,
            Nombre: "",
            IneFrente: "",
            IneReverso: "",
        });
        setOpenCreateModal(true);
    };

    const handleOpenUpdateModal = (beneficiario: EntBeneficiarios) => {
        setSelectedBeneficiario(beneficiario);
        setOpenUpdateModal(true);
    };

    const handleCloseModals = () => {
        setOpenCreateModal(false);
        setOpenUpdateModal(false);
        setSelectedBeneficiario(null);
    };

    const handleDeleteBeneficiario = async () => {
        if (!beneficiarioToDelete) return;
        const response = await BeneficiariosService.delete(beneficiarioToDelete);
        if (response.HasError) {
            toast.error(response.Message);
        } else {
            toast.success("Eliminado con éxito.");
            fetchBeneficiarios();
        }
        setOpenConfirmModal(false);
        setBeneficiarioToDelete(null);
    };

    const confirmDeleteBeneficiario = (id: string) => {
        setBeneficiarioToDelete(id);
        setOpenConfirmModal(true);
    };

    const handleSaveBeneficiario = async () => {
        const result = await BeneficiariosService.create(newBeneficiario);
        if (result.HasError) {
            toast.error(result.Message || "Error al crear.");
        } else {
            toast.success("Creado con éxito.");
            fetchBeneficiarios();
        }
        handleCloseModals();
    };

    const handleUpdateBeneficiario = async () => {
        if (!selectedBeneficiario) return;

        const updatePayload = {
            Id: selectedBeneficiario.Id,
            IdCripta: selectedBeneficiario.IdCripta,
            Nombre: selectedBeneficiario.Nombre,
            IneFrente: selectedBeneficiario.IneFrente,
            IneReverso: selectedBeneficiario.IneReverso
        };

        const result = await BeneficiariosService.update(updatePayload);
        if (result.HasError) {
            toast.error(result.Message || "Error al actualizar.");
        } else {
            toast.success("Actualizado con éxito.");
            fetchBeneficiarios();
        }
        handleCloseModals();
    };

    useEffect(() => {
        fetchBeneficiarios();
    }, []);

    return (
        <Box sx={{ width: "100%", backgroundColor: "#f2f2f2", minHeight: "90vh" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Beneficiarios
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <CustomIconButton onClick={handleOpenCreateModal} title="Agregar">
                            <AddIcon />
                        </CustomIconButton>
                        <CustomIconButton onClick={fetchBeneficiarios} title="Refrescar">
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
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>INE Frente</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>INE Reverso</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {beneficiarios.map((beneficiario) => (
                                    <TableRow key={beneficiario.Id}>
                                        <TableCell>{beneficiario.Nombre}</TableCell>
                                        <TableCell>{beneficiario.IneFrente ? "Sí" : "No"}</TableCell>
                                        <TableCell>{beneficiario.IneReverso ? "Sí" : "No"}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenUpdateModal(beneficiario)} title="Editar">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => confirmDeleteBeneficiario(beneficiario.Id)} title="Eliminar" sx={{ color: "red" }}>
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

            <GenericFormModal open={openCreateModal} title="Crear Beneficiario" onClose={handleCloseModals} onSubmit={handleSaveBeneficiario} isLoading={loading}>
                <CreateBeneficiario beneficiario={newBeneficiario} setBeneficiario={setNewBeneficiario} onSave={handleSaveBeneficiario} />
            </GenericFormModal>

            <GenericFormModal open={openUpdateModal} title="Actualizar Beneficiario" onClose={handleCloseModals} onSubmit={handleUpdateBeneficiario} isLoading={loading}>
                <UpdateBeneficiario
                    beneficiario={selectedBeneficiario!}
                    setBeneficiario={(data) => setSelectedBeneficiario((prev) => ({
                        ...(prev as EntBeneficiarios),
                        ...data,
                        FechaRegistro: prev?.FechaRegistro ?? new Date().toISOString(),
                        FechaActualizacion: new Date().toISOString(),
                        Estatus: prev?.Estatus ?? true
                    }))}
                    onSave={handleUpdateBeneficiario}
                />
            </GenericFormModal>


            <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteBeneficiario} title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar este beneficiario?" />
        </Box>
    );
};

export default IndexBeneficiarios;
