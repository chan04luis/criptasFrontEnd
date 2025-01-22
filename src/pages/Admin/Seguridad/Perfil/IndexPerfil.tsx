import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import MasterLayout from "../Modulos/MasterLayout";
import CustomIconButton from "../../../Utils/CustomIconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PerfilService from "../../../../services/Seguridad/PerfilService";
import { Perfil } from "../../../../entities/Seguridad/Perfil";
import { toast } from "react-toastify";
import GenericFormModal from "../../../Utils/GenericFormModal";
import PerfilForm from "./PerfilForm";
import ConfirmModal from "../../../Utils/ConfirmModal";
import { useNavigate } from "react-router-dom";

interface IndexPerfilProps {
  parentConfig: Configuracion | undefined;
}

const IndexPerfil: React.FC<IndexPerfilProps> = ({ parentConfig }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [datos, setDatos] = useState<Perfil[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

  const navigate = useNavigate();

  const nuevoPerfil = (): Perfil => ({
    IdPerfil: "",
    ClavePerfil: "",
    NombrePerfil: "",
    Eliminable: true,
    Activo: true,
  });

  const handleRefresh = async () => {
    if(!loading){
        setLoading(true);
        setDatos([]);
        try {
        const result = await PerfilService.get();
        if (result.HasError) {
            toast.warn(result.Message);
        } else {
            setDatos(result.Result || []);
        }
        } catch (error) {
        toast.error("Error al cargar los perfiles.");
        console.error(error);
        } finally {
        setLoading(false);
        }
    }
  };

  const handleOpenModal = (perfil: Perfil | null = null) => {
    setSelectedPerfil(perfil || nuevoPerfil());
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPerfil(null);
  };

  const handleSavePerfil = async () => {
    try {
      if (selectedPerfil) {
        if (selectedPerfil.IdPerfil) {
          const result = await PerfilService.update(selectedPerfil);
          if (result.HasError) {
            toast.error(result.Message || "Error al actualizar el perfil.");
          } else {
            toast.success("Perfil actualizado con éxito.");
          }
        } else {
          const result = await PerfilService.create(selectedPerfil);
          if (result.HasError) {
            toast.error(result.Message || "Error al crear el perfil.");
          } else {
            toast.success("Perfil creado con éxito.");
          }
        }
        handleCloseModal();
        handleRefresh();
      }
    } catch (error) {
      toast.error("Error al guardar el perfil.");
      console.error(error);
    }
  };

  const handleDeletePerfil = async () => {
    if (selectedPerfil) {
      try {
        const result = await PerfilService.delete(selectedPerfil.IdPerfil);
        if (result.HasError) {
          toast.error(result.Message || "Error al eliminar el perfil.");
        } else {
          toast.success("Perfil eliminado con éxito.");
          handleRefresh();
        }
      } catch (error) {
        toast.error("Error al eliminar el perfil.");
        console.error(error);
      }
    }
    setOpenConfirmModal(false);
  };

  const renderActions = (
    <>
      <CustomIconButton onClick={() => handleOpenModal()} title="Agregar nuevo">
        <AddIcon />
      </CustomIconButton>
      <CustomIconButton onClick={handleRefresh} disabled={loading} title="Refrescar datos">
        <RefreshIcon />
      </CustomIconButton>
    </>
  );

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Box display="flex" sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
        <MasterLayout titlePage="Perfiles del sistema" buttonActions={renderActions}>
          <Box p={2}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                <CircularProgress />
              </Box>
            ) : datos.length > 0 ? (
              datos.map((perfil) => (
                <Box
                  key={perfil.IdPerfil}
                  sx={{
                    padding: 2,
                    marginBottom: 2,
                    border: `1px solid ${parentConfig?.ColorPrimario}`,
                    borderRadius: 2,
                    backgroundColor: "white",
                  }}
                >
                  <Typography variant="h6" sx={{ color: parentConfig?.ColorPrimario }}>
                    {perfil.NombrePerfil}
                  </Typography>
                  <Typography variant="body2">Clave: {perfil.ClavePerfil}</Typography>
                  <Typography variant="body2">
                    Eliminable: {perfil.Eliminable ? "Sí" : "No"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <CustomIconButton
                      onClick={() => handleOpenModal(perfil)}
                      title="Editar perfil"
                    >
                      <EditIcon />
                    </CustomIconButton>
                    <CustomIconButton
                      disabled={!perfil.Eliminable}
                      onClick={() => {
                        setSelectedPerfil(perfil);
                        setOpenConfirmModal(true);
                      }}
                      title="Eliminar perfil"
                    >
                      <DeleteForeverIcon />
                    </CustomIconButton>
                    <CustomIconButton
                      onClick={() => navigate(`/admin/perfiles/permisos/${perfil.IdPerfil}`)}
                      title="Permisos de perfil"
                    >
                      <AdminPanelSettingsIcon />
                    </CustomIconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>No hay perfiles disponibles.</Typography>
            )}
          </Box>
        </MasterLayout>
      </Box>

      <GenericFormModal
        open={openModal}
        title={selectedPerfil?.IdPerfil ? "Editar Perfil" : "Crear Perfil"}
        onClose={handleCloseModal}
        onSubmit={handleSavePerfil}
        isLoading={loading}
      >
        <PerfilForm data={selectedPerfil || nuevoPerfil()} onChange={setSelectedPerfil} />
      </GenericFormModal>

      <ConfirmModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleDeletePerfil}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este perfil?"
      />
    </Box>
  );
};

export default IndexPerfil;
