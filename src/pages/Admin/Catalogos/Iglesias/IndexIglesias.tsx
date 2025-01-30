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
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import ConfirmModal from "../../../Utils/ConfirmModal";
import GenericFormModal from "../../../Utils/GenericFormModal";
import CreateIglesia from "./CreateIglesia";
import UpdateIglesia from "./UpdateIglesia";
import UpdateIglesiaMaps from "./UpdateIglesiaMaps";
import { Iglesia } from "../../../../entities/catalogos/iglesias/Iglesia";
import { IglesiaCreate } from "../../../../entities/catalogos/iglesias/IglesiaCreate";
import { IglesiaUpdate } from "../../../../entities/catalogos/iglesias/IglesiaUpdate";
import { IglesiaUpdateMaps } from "../../../../entities/catalogos/iglesias/IglesiaUpdateMaps";
import IglesiaService from "../../../../services/Catalogos/IglesiaService";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "../../../Utils/CustomIconButton";

interface IndexIglesiasProps {
  parentConfig: Configuracion | undefined;
}

const IndexIglesias: React.FC<IndexIglesiasProps> = ({ parentConfig }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [iglesias, setIglesias] = useState<Iglesia[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [openLocationModal, setOpenLocationModal] = useState<boolean>(false);
  const [selectedIglesia, setSelectedIglesia] = useState<IglesiaUpdate | IglesiaCreate | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<IglesiaUpdateMaps | null>(null);
  const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);

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

  const handleOpenModal = (iglesia: Iglesia | null = null) => {
    if (iglesia) {
      setSelectedIglesia({
        Id: iglesia.Id,
        Nombre: iglesia.Nombre,
        Direccion: iglesia.Direccion,
        Ciudad: iglesia.Ciudad,
      } as IglesiaUpdate);
    } else {
      setSelectedIglesia({
        Nombre: "",
        Direccion: "",
        Ciudad: "",
      } as IglesiaCreate);
    }
    setOpenModal(true);
  };

  const isIglesiaUpdate = (iglesia: IglesiaCreate | IglesiaUpdate): iglesia is IglesiaUpdate => {
    return "Id" in iglesia;
  };
  
  const navigate = useNavigate();

  const handleOpenLocationModal = (iglesia: Iglesia) => {
    setSelectedLocation({
      Id: iglesia.Id,
      Latitud: iglesia.Latitud,
      Longitud: iglesia.Longitud,
    });
    setOpenLocationModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenLocationModal(false);
    setSelectedIglesia(null);
    setSelectedLocation(null);
  };

  const handleSaveIglesia = async () => {
    if (selectedIglesia) {
      if ("Id" in selectedIglesia && selectedIglesia.Id) {
        const result = await IglesiaService.updateIglesia(selectedIglesia as IglesiaUpdate);
        if (result.HasError) {
          toast.error(result.Message || "Error al actualizar la iglesia.");
        } else {
          toast.success("Iglesia actualizada con éxito.");
        }
      } else {
        const result = await IglesiaService.createIglesia(selectedIglesia as IglesiaCreate);
        if (result.HasError) {
          toast.error(result.Message || "Error al crear la iglesia.");
        } else {
          toast.success("Iglesia creada con éxito.");
        }
      }
    }
    handleCloseModal();
    fetchIglesias();
  };

  const handleUpdateLocation = async () => {
    if (selectedLocation) {
      const result = await IglesiaService.updateIglesiaMaps(selectedLocation);
      if (result.HasError) {
        toast.error(result.Message || "Error al actualizar ubicación.");
      } else {
        toast.success("Ubicación actualizada con éxito.");
      }
    }
    handleCloseModal();
    fetchIglesias();
  };

  const handleDeleteConfirm = async () => {
    if (handleDelete) {
      await handleDelete();
      setOpenConfirmModal(false);
    }
  };

  const handleDeleteIglesia = async (id: string): Promise<void> => {
    setHandleDelete(() => async () => {
      const response = await IglesiaService.deleteIglesia(id);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Iglesia eliminada con éxito.");
        fetchIglesias();
      }
    });
    setOpenConfirmModal(true);
  };

  useEffect(() => {
    fetchIglesias();
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
            Iglesias
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <CustomIconButton onClick={() => handleOpenModal(null)} title="Agregar">
                <AddIcon />
            </CustomIconButton>
            <CustomIconButton onClick={fetchIglesias} title="Refrescar">
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
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {iglesias.map((iglesia) => (
                  <TableRow key={iglesia.Id}>
                    <TableCell>{iglesia.Nombre}</TableCell>
                    <TableCell>{iglesia.Direccion}</TableCell>
                    <TableCell>{iglesia.Ciudad}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(iglesia)} title="Editar">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenLocationModal(iglesia)} title="Actualizar ubicación">
                        <LocationOnIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteIglesia(iglesia.Id)} title="Eliminar" sx={{ color: "red" }}>
                        <DeleteForeverIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => navigate(`/admin/catalogos/zonas/${iglesia.Id}`)}
                        title="Gestión de Iglesia"
                        >
                        <AdminPanelSettingsIcon />
                        </IconButton>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <GenericFormModal 
        open={openModal} 
        title={selectedIglesia && isIglesiaUpdate(selectedIglesia) ? "Editar Iglesia" : "Crear Iglesia"} 
        onClose={handleCloseModal} 
        onSubmit={handleSaveIglesia} 
        isLoading={loading}
        >
        {selectedIglesia && isIglesiaUpdate(selectedIglesia) ? (
            <UpdateIglesia setIglesia={setSelectedIglesia} iglesia={selectedIglesia} onSave={handleSaveIglesia} />
        ) : (
            <CreateIglesia setIglesia={setSelectedIglesia} iglesia={selectedIglesia as IglesiaCreate} onSave={handleSaveIglesia} />
        )}
        </GenericFormModal>


      <GenericFormModal open={openLocationModal} title="Actualizar Ubicación" onClose={handleCloseModal} onSubmit={handleUpdateLocation} isLoading={loading}>
        <UpdateIglesiaMaps setIglesia={setSelectedLocation} iglesia={selectedLocation as IglesiaUpdateMaps} onSave={handleCloseModal} />
      </GenericFormModal>

      <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteConfirm} title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar esta iglesia?" />
    </Box>
  );
};

export default IndexIglesias;
