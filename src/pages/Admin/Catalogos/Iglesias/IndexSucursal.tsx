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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Utils/ConfirmModal";
import GenericFormModal from "../../../Utils/GenericFormModal";
import CreateSucursal from "./CreateSucursal";
import UpdateSucursal from "./UpdateSucursal";
import UpdateSucursalMaps from "./UpdateSucursalMaps";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CustomIconButton from "../../../Utils/CustomIconButton";
import { RootObject } from "../../../../entities/Seguridad/RootObject";
import { Sucursal } from "../../../../entities/Catalogos/sucursales/Sucursal";
import { SucursalUpdate } from "../../../../entities/Catalogos/sucursales/SucursalUpdate";
import { SucursalCreate } from "../../../../entities/Catalogos/sucursales/SucursalCreate";
import { SucursalUpdateMaps } from "../../../../entities/Catalogos/sucursales/SucursalUpdateMaps";
import SucursalService from "../../../../services/Catalogo/SucursalService";
import AssignServiciosModal from "./AssignServiciosModal";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

interface IndexSucursalesProps {
  result: RootObject | null;
}

const IndexSucursales: React.FC<IndexSucursalesProps> = ({ result }) => {
  var parentConfig = result?.Configuracion;
  const [loading, setLoading] = useState<boolean>(false);
  const [sucursales, setSucursals] = useState<Sucursal[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [openLocationModal, setOpenLocationModal] = useState<boolean>(false);
  const [selectedSucursal, setselectedSucursal] = useState<SucursalUpdate | SucursalCreate | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SucursalUpdateMaps | null>(null);
  const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);
  const [openAssignModal, setOpenAssignModal] = useState<boolean>(false);
  const [selectedSucursalId, setSelectedSucursalId] = useState<string | null>(null);

  const handleOpenAssignModal = (sucursalId: string) => {
    setSelectedSucursalId(sucursalId);
    setOpenAssignModal(true);
  };

  const fetchSucursales = async () => {
    setLoading(true);
    try {
      const response = await SucursalService.getSucursales();
      if (!response.HasError) {
        setSucursals(response.Result || []);
      } else {
        toast.warn(response.Message);
      }
    } catch (error) {
      toast.error("Error al cargar las sucursales.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sucursal: Sucursal | null = null) => {
    if (sucursal) {
      setselectedSucursal({
        Id: sucursal.Id,
        Nombre: sucursal.Nombre,
        Telefono: sucursal.Telefono,
        Direccion: sucursal.Direccion,
        Ciudad: sucursal.Ciudad,
      } as SucursalUpdate);
    } else {
      setselectedSucursal({
        Nombre: "",
        Direccion: "",
        Telefono: "",
        Ciudad: "",
      } as SucursalCreate);
    }
    setOpenModal(true);
  };

  const isSucursalUpdate = (sucursal: SucursalCreate | SucursalUpdate): sucursal is SucursalUpdate => {
    return "Id" in sucursal;
  };


  const handleOpenLocationModal = (sucursal: Sucursal) => {
    setSelectedLocation({
      Id: sucursal.Id,
      Latitud: sucursal.Latitud,
      Longitud: sucursal.Longitud,
    });
    setOpenLocationModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenLocationModal(false);
    setselectedSucursal(null);
    setSelectedLocation(null);
  };

  const handleSaveSucursal = async () => {
    if (selectedSucursal) {
      if ("Id" in selectedSucursal && selectedSucursal.Id) {
        const result = await SucursalService.updateSucursal(selectedSucursal as SucursalUpdate);
        if (result.HasError) {
          toast.error(result.Message || "Error al actualizar la Sucursal.");
        } else {
          toast.success("Sucursal actualizada con éxito.");
        }
      } else {
        const result = await SucursalService.createSucursal(selectedSucursal as SucursalCreate);
        if (result.HasError) {
          toast.error(result.Message || "Error al crear la sucursal.");
        } else {
          toast.success("Sucursal creada con éxito.");
        }
      }
    }
    handleCloseModal();
    fetchSucursales();
  };

  const handleUpdateLocation = async () => {
    if (selectedLocation) {
      const result = await SucursalService.updateSucursalMaps(selectedLocation);
      if (result.HasError) {
        toast.error(result.Message || "Error al actualizar ubicación.");
      } else {
        toast.success("Ubicación actualizada con éxito.");
      }
    }
    handleCloseModal();
    fetchSucursales();
  };

  const handleDeleteConfirm = async () => {
    if (handleDelete) {
      await handleDelete();
      setOpenConfirmModal(false);
    }
  };

  const handleDeleteSucursal = async (id: string): Promise<void> => {
    setHandleDelete(() => async () => {
      const response = await SucursalService.deleteSucursal(id);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Sucursal eliminada con éxito.");
        fetchSucursales();
      }
    });
    setOpenConfirmModal(true);
  };

  const handleUpdateStatus = async (item: Sucursal) => {
    try {
      item.Estatus = !item.Estatus;
      const response = await SucursalService.updateSucursalestatus(item.Id, item.Estatus);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Estatus actualizado con éxito.");
        fetchSucursales();
      }
    } catch (error) {
      toast.error("Error al actualizar el estatus.");
    }
  };

  useEffect(() => {
    fetchSucursales();
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
            Sucursales
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {result?.PermisosBotones.find(x => x.ClaveBoton == 'add_sucursal')?.TienePermiso && <CustomIconButton onClick={() => handleOpenModal(null)} title="Agregar">
              <AddIcon />
            </CustomIconButton>}
            <CustomIconButton onClick={fetchSucursales} title="Refrescar">
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
                  <TableCell>Estatus</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sucursales.map((sucursal) => (
                  <TableRow key={sucursal.Id}>
                    <TableCell>{sucursal.Nombre}</TableCell>
                    <TableCell>{sucursal.Direccion}</TableCell>
                    <TableCell>{sucursal.Ciudad}</TableCell>
                    <TableCell>
                      {result?.PermisosBotones.find(x => x.ClaveBoton == 'status_sucursal')?.TienePermiso ? <IconButton
                        onClick={() => handleUpdateStatus(sucursal)}
                        title={sucursal.Estatus ? "Deshabilitar" : "Habilitar"}
                        sx={{ color: sucursal.Estatus ? "green" : "gray" }}
                      >
                        {sucursal.Estatus ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton> : sucursal.Estatus ? <ToggleOnIcon sx={{ color: "green" }} /> : <ToggleOffIcon sx={{ color: "gray" }} />}
                    </TableCell>
                    <TableCell>
                      {result?.PermisosBotones.find(x => x.ClaveBoton == 'edit_sucursal')?.TienePermiso && <IconButton onClick={() => handleOpenModal(sucursal)} title="Editar">
                        <EditIcon />
                      </IconButton>}
                      {result?.PermisosBotones.find(x => x.ClaveBoton == 'edit_marker_sucursal')?.TienePermiso && <IconButton onClick={() => handleOpenLocationModal(sucursal)} title="Actualizar ubicación">
                        <LocationOnIcon />
                      </IconButton>}
                      {result?.PermisosBotones.find(x => x.ClaveBoton == 'delete_sucursal')?.TienePermiso && <IconButton onClick={() => handleDeleteSucursal(sucursal.Id)} title="Eliminar" sx={{ color: "red" }}>
                        <DeleteForeverIcon />
                      </IconButton>}

                      {result?.PermisosBotones.find(x => x.ClaveBoton == 'add_service_to_sucursal')?.TienePermiso && <IconButton onClick={() => handleOpenAssignModal(sucursal.Id)} title="Asignar Servicios">
                        <PlaylistAddIcon />
                      </IconButton>}

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <AssignServiciosModal
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        sucursalId={selectedSucursalId}
      />


      <GenericFormModal
        open={openModal}
        title={selectedSucursal && isSucursalUpdate(selectedSucursal) ? "Editar Sucursal" : "Crear Sucursal"}
        onClose={handleCloseModal}
        onSubmit={handleSaveSucursal}
        isLoading={loading}
      >
        {selectedSucursal && isSucursalUpdate(selectedSucursal) ? (
          <UpdateSucursal setSucursal={setselectedSucursal} sucursal={selectedSucursal} onSave={handleSaveSucursal} />
        ) : (
          <CreateSucursal setSucursal={setselectedSucursal} sucursal={selectedSucursal as SucursalCreate} onSave={handleSaveSucursal} />
        )}
      </GenericFormModal>


      <GenericFormModal open={openLocationModal} title="Actualizar Ubicación" onClose={handleCloseModal} onSubmit={handleUpdateLocation} isLoading={loading}>
        <UpdateSucursalMaps setSucursal={setSelectedLocation} sucursal={selectedLocation as SucursalUpdateMaps} onSave={handleCloseModal} />
      </GenericFormModal>

      <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteConfirm} title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar esta Sucursal?" />
    </Box>
  );
};

export default IndexSucursales;
