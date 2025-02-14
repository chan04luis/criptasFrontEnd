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
  TableRow
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RefreshIcon from "@mui/icons-material/Refresh";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { toast } from "react-toastify";
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import ConfirmModal from "../../../Utils/ConfirmModal";
import GenericFormModal from "../../../Utils/GenericFormModal";
import SeccionForm from "./SeccionForm";
import IglesiaSeccionService from "../../../../services/Catalogos/IglesiaSeccionService";
import { useParams, useNavigate } from "react-router-dom";
import { Secciones } from "../../../../entities/catalogos/secciones/Secciones";
import CriptasModal from "../Criptas/CriptasModal";
import CustomIconButton from "../../../Utils/CustomIconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface IndexSeccionesProps {
  parentConfig: Configuracion | undefined;
}

const IndexSecciones: React.FC<IndexSeccionesProps> = ({ parentConfig }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [secciones, setSecciones] = useState<Secciones[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [selectedSeccion, setSelectedSeccion] = useState<Secciones | null>(null);
  const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);
  const [openCriptasModal, setOpenCriptasModal] = useState<boolean>(false);

  const handleOpenCriptasModal = (idSeccion: Secciones) => {
    setSelectedSeccion(idSeccion);
    setOpenCriptasModal(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCloseCriptasModal = () => {
    setOpenCriptasModal(false);
    setSelectedSeccion(null);
  };

  const fetchSecciones = async () => {
    setLoading(true);
    try {
      const response = await IglesiaSeccionService.getSeccionesByZona(id);
      if (!response.HasError) {
        setSecciones(response.Result || []);
      } else {
        toast.warn(response.Message);
      }
    } catch (error) {
      toast.error("Error al cargar las secciones.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (seccion: Secciones | null = null) => {
    if (seccion) {
      setSelectedSeccion(seccion);
    } else {
      setSelectedSeccion({
        Id: "",
        IdZona: id,
        Nombre: "",
        FechaRegistro: "",
        FechaActualizacion: "",
        Estatus: true,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSeccion(null);
  };

  const handleSaveSeccion = async () => {
    if (selectedSeccion) {
      const result = await IglesiaSeccionService.createOrUpdateSeccion(selectedSeccion);
      if (result.HasError) {
        toast.error(result.Message || "Error al guardar la sección.");
      } else {
        toast.success("Sección guardada con éxito.");
        fetchSecciones();
      }
    }
    handleCloseModal();
  };

  const handleUpdateStatus = async (item: Secciones) => {
    try {
      item.Estatus = !item.Estatus;
      const response = await IglesiaSeccionService.UpdateEstatusSeccion(item);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Estatus actualizado con éxito.");
        fetchSecciones();
      }
    } catch (error) {
      toast.error("Error al actualizar el estatus.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (handleDelete) {
      await handleDelete();
      setOpenConfirmModal(false);
    }
  };

  const handleDeleteSeccion = async (id: string): Promise<void> => {
    setHandleDelete(() => async () => {
      const response = await IglesiaSeccionService.deleteSeccion(id);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Sección eliminada con éxito.");
        fetchSecciones();
      }
    });
    setOpenConfirmModal(true);
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f2f2f2",
        minHeight: "90vh",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
            Secciones de la Zona
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <CustomIconButton onClick={handleGoBack} title="Regresar">
              <ArrowBackIcon />
            </CustomIconButton>
            <CustomIconButton onClick={() => handleOpenModal(null)} title="Agregar">
              <AddIcon />
            </CustomIconButton>
            <CustomIconButton onClick={fetchSecciones} title="Refrescar">
              <RefreshIcon />
            </CustomIconButton>
          </Box>

        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ margin: 2, padding: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sección</TableCell>
                <TableCell>Fecha de Actualización</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Estatus</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {secciones.map((seccion) => (
                <TableRow key={seccion.Id}>
                  <TableCell>{seccion.Nombre}</TableCell>
                  <TableCell>{seccion.FechaActualizacion}</TableCell>
                  <TableCell>{seccion.FechaRegistro}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleUpdateStatus(seccion)}
                      title={seccion.Estatus ? "Deshabilitar" : "Habilitar"}
                      sx={{ color: seccion.Estatus ? "green" : "gray" }}
                    >
                      {seccion.Estatus ? <ToggleOnIcon /> : <ToggleOffIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(seccion)} title="Editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSeccion(seccion.Id)} title="Eliminar" sx={{ color: "red" }}>
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenCriptasModal(seccion)}
                      title="Gestión de criptas"
                    >
                      <AdminPanelSettingsIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <GenericFormModal open={openModal} title="Sección" onClose={handleCloseModal} onSubmit={handleSaveSeccion} isLoading={loading}>
        <SeccionForm setSeccion={setSelectedSeccion} seccion={selectedSeccion!} onSave={handleSaveSeccion} />
      </GenericFormModal>

      <GenericFormModal
        open={openCriptasModal}
        onSubmit={handleCloseCriptasModal}
        title={`Criptas de la Sección: ${selectedSeccion?.Nombre}`}
        onClose={handleCloseCriptasModal}
        isLoading={false}
      >
        {selectedSeccion && (
          <CriptasModal idSeccion={selectedSeccion.Id} parentConfig={parentConfig} />
        )}
      </GenericFormModal>

      <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteConfirm} title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar esta sección?" />
    </Box>
  );
};

export default IndexSecciones;
