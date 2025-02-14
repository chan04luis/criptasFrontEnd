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
  TableFooter,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import { toast } from "react-toastify";
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import ConfirmModal from "../../../Utils/ConfirmModal";
import GenericFormModal from "../../../Utils/GenericFormModal";
import CreateCliente from "./CreateCliente";
import UpdateCliente from "./UpdateCliente";
import ClienteService from "../../../../services/Catalogos/ClienteService";
import CustomIconButton from "../../../Utils/CustomIconButton";
import { Cliente, ClienteUpdatePayload, ClienteCreatePayload, ClienteFilters } from "../../../../entities/Cliente";
import GenericFilterForm, { FilterField } from "../../../Utils/GenericFilterForm";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GiCoffin } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

interface IndexClientesProps {
  parentConfig: Configuracion | undefined;
}

const IndexClientes: React.FC<IndexClientesProps> = ({ parentConfig }) => {
  const loadCliente = () => {
    return {
      Nombres: "",
      Apellidos: "",
      Direccion: "",
      FechaNac: "",
      FechaNacD: new Date(),
      Sexo: "",
      Telefono: "",
      Email: "",
    }
  }
  const loadFilters = () => {
    return {
      Id: "",
      Nombre: "",
      Apellido: "",
      Correo: "",
      Estatus: true,
      NumPag: 1,
      NumReg: 10
    }
  }
  const [loading, setLoading] = useState<boolean>(false);
  const [totalReg, setTotalReg] = useState<number>(0);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedClienteC, setSelectedClienteC] = useState<ClienteCreatePayload>(loadCliente);
  const [selectedClienteU, setSelectedClienteU] = useState<ClienteUpdatePayload | undefined>(undefined);
  const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);
  const [filters, setFilters] = useState<ClienteFilters>(loadFilters);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const filterFields: FilterField<ClienteFilters>[] = [
    { type: "text", name: "Nombre", label: "Nombre", value: filters.Nombre },
    { type: "text", name: "Apellido", label: "Apellido", value: filters.Apellido },
    { type: "autocomplete", name: "Estatus", label: "Estatus", value: filters.Estatus, options: [{ id: true, label: "Activo" }, { id: false, label: "Inactivo" }] },
  ];

  const navigate = useNavigate();

  const handleRedirectToMisCriptas = (idCripta: string) => {
    navigate(`/admin/catalogos/miscriptas/${idCripta}`);
  };

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await ClienteService.getClientesByFilters(filters);
      if (!response.HasError) {
        setClientes(response.Result.Items || []);
        setTotalReg(response.Result.TotalRecords);
      } else {
        setTotalReg(0);
        setClientes([]);
        toast.warn(response.Message);
      }
    } catch (error) {
      toast.error("Error al cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cliente: Cliente | null = null) => {
    if (cliente == null)
      setSelectedClienteC(loadCliente());
    setSelectedCliente(cliente);
    setSelectedClienteU(cliente as ClienteUpdatePayload);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCliente(null);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const handleUpdateStatus = async (item: Cliente) => {
    try {
      item.Estatus = !item.Estatus;
      const response = await ClienteService.updateClienteStatus(item);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Estatus actualizado con éxito.");
        fetchClientes();
      }
    } catch (error) {
      toast.error("Error al actualizar el estatus.");
    }
  };

  const handleSaveCliente = async () => {
    if (selectedCliente || (selectedClienteC.Nombres != "" && selectedClienteC.Email != "" && selectedClienteC.Sexo != "")) {
      if (selectedCliente?.Id && selectedClienteU != undefined && selectedClienteU != null) {
        const result = await ClienteService.updateCliente(selectedClienteU);
        if (result.HasError) {
          toast.error(result.Message || "Error al actualizar el cliente.");
        } else {
          toast.success("Cliente actualizado con éxito.");
        }
      } else {
        selectedClienteC.FechaNac = formatDate(selectedClienteC.FechaNacD).slice(0, 10);
        const result = await ClienteService.createCliente(selectedClienteC);
        if (result.HasError) {
          toast.error(result.Message || "Error al crear el cliente.");
        } else {
          toast.success("Cliente creado con éxito.");
        }
      }
    }
    handleCloseModal();
    fetchClientes();
  };

  const handleDeleteConfirm = async () => {
    if (handleDelete) {
      await handleDelete();
      setOpenConfirmModal(false);
    }
  };

  const onPageChange = (page: number) => {
    filters.NumPag = page;
    setFilters((prevFiltros) => ({
      ...prevFiltros,
      NumPag: page,
    }));
    fetchClientes();
  };

  const onPageSizeChange = (size: number) => {
    filters.NumReg = size;
    setFilters((prevFiltros) => ({
      ...prevFiltros,
      NumReg: size,
      NumPag: 1,
    }));
    fetchClientes();
  };

  const handleDeleteCliente = async (id: string): Promise<void> => {
    setHandleDelete(() => async () => {
      const response = await ClienteService.deleteCliente(id);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Cliente eliminado con éxito.");
        fetchClientes();
      }
    });
    setOpenConfirmModal(true);
  };

  const capitalizeEachWord = (str: string): string => {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchClientes();
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
            Clientes
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <CustomIconButton onClick={() => handleOpenModal(null)} title="Agregar">
              <AddIcon />
            </CustomIconButton>
            <CustomIconButton onClick={fetchClientes} title="Refrescar">
              <RefreshIcon />
            </CustomIconButton>
            <CustomIconButton
              onClick={toggleDrawer}
              title="Filtros"
            >
              <FilterListIcon />
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
                  <TableCell>Correo</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Sexo</TableCell>
                  <TableCell>Origen</TableCell>
                  <TableCell>Estatus</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.Id}>
                    <TableCell>{capitalizeEachWord(`${cliente.Nombres} ${cliente.Apellidos}`)}</TableCell>
                    <TableCell>{cliente.Email}</TableCell>
                    <TableCell>{cliente.Telefono}</TableCell>
                    <TableCell>{capitalizeEachWord(cliente.Sexo)}</TableCell>
                    <TableCell>{cliente.Origen === 1 ? "WEB" : "APP"}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleUpdateStatus(cliente)}
                        title={cliente.Estatus ? "Deshabilitar" : "Habilitar"}
                        sx={{ color: cliente.Estatus ? "green" : "gray" }}
                      >
                        {cliente.Estatus ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(cliente)} title="Editar">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCliente(cliente.Id)} title="Eliminar" sx={{ color: "red" }}>
                        <DeleteForeverIcon />
                      </IconButton>
                      <IconButton
                        title="Ver criptas"
                        onClick={() => handleRedirectToMisCriptas(cliente.Id)}
                        sx={{ color: "darkred" }}
                      >
                        <GiCoffin />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box display="flex" justifyContent="center">
                      <TablePagination
                        component="div"
                        count={totalReg}
                        page={filters.NumPag - 1}
                        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
                        rowsPerPage={filters.NumReg}
                        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        labelRowsPerPage="Registros por página:"
                        labelDisplayedRows={({ from, to, count }) =>
                          `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <GenericFormModal
        open={openModal}
        title={selectedCliente ? "Editar Cliente" : "Crear Cliente"}
        onClose={handleCloseModal}
        onSubmit={handleSaveCliente}
        isLoading={loading}
      >
        {selectedCliente ? (
          <UpdateCliente setCliente={setSelectedClienteU} cliente={selectedClienteU} onSave={handleSaveCliente} />
        ) : (
          <CreateCliente setCliente={setSelectedClienteC} cliente={selectedClienteC} onSave={handleSaveCliente} />
        )}
      </GenericFormModal>

      <GenericFilterForm
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchClientes}
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        fields={filterFields}
      />


      <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} onConfirm={handleDeleteConfirm} title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar este cliente?" />
    </Box>
  );
};

export default IndexClientes;
