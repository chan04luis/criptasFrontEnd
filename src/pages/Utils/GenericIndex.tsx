import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import GenericFormModal from "./GenericFormModal"; // Modal genérico para formularios
import { User, UserCreatePayload } from "../../entities/User";

interface ConfiguracionProps {
  colorPrimary: string;
  contrastePrimary: string;
  colorSecundario: string;
  contrasteSecondario: string;
}

interface PaginatedResponse<T> {
  totalRegistros: number;
  pagina: number;
  datos: T[];
}

interface GenericIndexProps<T, F> {
  title: string;
  titleModal: string;
  user: User  | UserCreatePayload;
  setUser: (user: UserCreatePayload | User) => void;
  configuracion: ConfiguracionProps;
  filtrosIniciales: F;
  fetchData: (filtros: F) => Promise<PaginatedResponse<T> | null>;
  insertData: (onSave:() => void) => Promise<void>;
  updateData: (onSave:() => void) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  updateStatus: (id: string, newStatus: string) => Promise<void>;
  renderTable: (
    data: PaginatedResponse<T>,
    filtros: F,
    setFiltros: React.Dispatch<React.SetStateAction<F>>,
    onEdit: (item: T) => void,
    onDelete: (id: string) => void,
    onUpdateStatus: (id: string, newStatus: string) => void
  ) => React.ReactNode;
  renderFilterForm: (
    filtros: F,
    setFiltros: React.Dispatch<React.SetStateAction<F>>,
    onBuscar: () => void,
    toggleDrawer: () => void,
    isDrawerOpen: boolean
  ) => React.ReactNode;
  renderForm: (onClose: () => void, onSave: () => void) => React.ReactNode;
}

const GenericIndex = <T, F>({
  title,
  titleModal,
  user,
  setUser,
  configuracion,
  filtrosIniciales,
  fetchData,
  insertData,
  updateData,
  deleteData,
  updateStatus,
  renderTable,
  renderFilterForm,
  renderForm,
}: GenericIndexProps<T, F>) => {
  const [filtros, setFiltros] = useState<F>(filtrosIniciales);
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triggerSearch, setTriggerSearch] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  useEffect(() => {
    if (!triggerSearch) return;

    const handleBuscar = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData(filtros);
        if (response) {
          setData(response);
        } else {
          console.error("Error al obtener los datos.");
        }
      } catch (error) {
        console.error("Error al realizar la búsqueda.", error);
      } finally {
        setIsLoading(false);
        setTriggerSearch(false);
      }
    };

    handleBuscar();
  }, [filtros, triggerSearch, fetchData]);

  const handleManualBuscar = () => {
    setTriggerSearch(true);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleOpenModal = (item: T | null = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const handleOpenNewModal = () => {
    const item : UserCreatePayload = {
        Nombres: "",
        Apellidos: "",
        Correo:  "",
        Contra: "",
        Telefono: "",
        Activo: true,
    }
    setUser(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveModal = async () => {
    try {
      if (selectedItem) {
        await updateData(handleCloseModal);
      } else {
        await insertData(handleCloseModal);
      }
      handleCloseModal();
      handleManualBuscar(); // Refresca la lista
    } catch (error) {
      console.error("Error al guardar el elemento.", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteData(id);
      handleManualBuscar(); // Refresca la lista
    } catch (error) {
      console.error("Error al eliminar el elemento.", error);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateStatus(id, newStatus);
      handleManualBuscar(); // Refresca la lista
    } catch (error) {
      console.error("Error al actualizar el estatus.", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f2f2f2", minHeight: "90vh",  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: configuracion.colorSecundario }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: configuracion.contrasteSecondario }}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => handleOpenNewModal()}
            color="primary"
            sx={{
                backgroundColor: "#fff",
                color: "#FF9800",
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
            <AddIcon />
            </IconButton>

            <IconButton
              onClick={handleManualBuscar}
              title="Actualizar datos"
              sx={{
                backgroundColor: "#fff",
                color: "#FF9800",
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              onClick={toggleDrawer}
              title="Filtros"
              sx={{
                backgroundColor: "#fff",
                color: "#FF9800",
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderFilterForm(
        filtros,
        setFiltros,
        handleManualBuscar,
        toggleDrawer,
        isDrawerOpen
      )}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        data &&
        renderTable(
          data,
          filtros,
          setFiltros,
          handleOpenModal,
          handleDelete,
          handleUpdateStatus
        )
      )}
      <GenericFormModal
        open={isModalOpen}
        title={ (selectedItem ? "Editar " : "Crear ") + titleModal}
        onClose={handleCloseModal}
        onSubmit={handleSaveModal}
      >
        {renderForm(handleCloseModal, handleSaveModal)}
      </GenericFormModal>
    </Box>
  );
};

export default GenericIndex;
