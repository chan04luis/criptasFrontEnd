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
import { toast } from "react-toastify";
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import ConfirmModal from "../../../Utils/ConfirmModal";
import GenericFormModal from "../../../Utils/GenericFormModal";
import ZonaForm from "./ZonaForm";
import IglesiaZonaService from "../../../../services/Catalogos/IglesiaZonaService";
import { useParams } from "react-router-dom";
import { Zona } from "../../../../entities/catalogos/zonas/Zona";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "../../../Utils/CustomIconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


interface IndexZonasProps {
  parentConfig: Configuracion | undefined;
}

const IndexZonas: React.FC<IndexZonasProps> = ({ parentConfig }) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [selectedZona, setSelectedZona] = useState<Zona | null>(null);
  const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);
  const navigate = useNavigate();

  const fetchZonas = async () => {
    setLoading(true);
    try {
      const response = await IglesiaZonaService.getZonasByIglesia(id);
      if (!response.HasError) {
        setZonas(response.Result || []);
      } else {
        toast.warn(response.Message);
      }
    } catch (error) {
      toast.error("Error al cargar las zonas.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleOpenModal = (zona: Zona | null = null) => {
    if (zona) {
      setSelectedZona(zona);
    } else {
      setSelectedZona({
        Id: "",
        IdIglesia: id,
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
    setSelectedZona(null);
  };

  const handleSaveZona = async () => {
    if (selectedZona) {
      const result = await IglesiaZonaService.createOrUpdateZona(selectedZona);
      if (result.HasError) {
        toast.error(result.Message || "Error al guardar la zona.");
      } else {
        toast.success("Zona guardada con éxito.");
        fetchZonas();
      }
    }
    handleCloseModal();
  };

  const handleUpdateStatus = async (item : Zona) => {
    try {
        item.Estatus = !item.Estatus;
      const response = await IglesiaZonaService.UpdateEstatusZona(item);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Estatus actualizado con éxito.");
        fetchZonas();
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

  const handleDeleteZona = async (id: string): Promise<void> => {
    setHandleDelete(() => async () => {
      const response = await IglesiaZonaService.deleteZona(id);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Zona eliminada con éxito.");
        fetchZonas();
      }
    });
    setOpenConfirmModal(true);
  };

  useEffect(() => {
    fetchZonas();
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
            Zonas de la Iglesia
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <CustomIconButton onClick={handleGoBack} title="Regresar">
                <ArrowBackIcon />
            </CustomIconButton>
            <CustomIconButton onClick={() => handleOpenModal(null)} title="Agregar">
                <AddIcon />
            </CustomIconButton>
            <CustomIconButton onClick={fetchZonas} title="Refrescar">
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
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Estatus</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zonas.map((zona) => (
                <TableRow key={zona.Id}>
                  <TableCell>{zona.Nombre}</TableCell>
                  <TableCell>{zona.FechaRegistro}</TableCell>
                    <TableCell>
                    <IconButton
                        onClick={() => handleUpdateStatus(zona)}
                        title={zona.Estatus ? "Deshabilitar" : "Habilitar"}
                        sx={{ color: zona.Estatus ? "green" : "gray" }}
                    >
                        {zona.Estatus ? <ToggleOnIcon /> : <ToggleOffIcon />}
                    </IconButton>
                    </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(zona)} title="Editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteZona(zona.Id)} title="Eliminar" sx={{ color: "red" }}>
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => navigate(`/admin/catalogos/secciones/${zona.Id}`)}
                        title="Gestión de zona"
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

      <GenericFormModal open={openModal} title="Zona" onClose={handleCloseModal} onSubmit={handleSaveZona} isLoading={loading}>
        <ZonaForm setZona={setSelectedZona} zona={selectedZona!} onSave={handleSaveZona} />
      </GenericFormModal>

      <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteConfirm} title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar esta zona?" />
    </Box>
  );
};

export default IndexZonas;
