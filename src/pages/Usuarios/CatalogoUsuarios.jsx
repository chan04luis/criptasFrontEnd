import React, { useState, useEffect } from "react";
import { getUsuarios, createUsuario, updateUsuarioStatus, deleteUsuario, updateUsuario } from "../../api/usuarios";
import { Check, Cancel, Delete, Sync, Edit, Add } from "@mui/icons-material";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";

const CatalogoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editUser, setEditUser] = useState({
    Id:0,
    Nombres: "",
    Apellidos: "",
    Telefono: "",
  }); 
  const [newUser, setNewUser] = useState({
    Nombres: "",
    Apellidos: "",
    Correo: "",
    Contra: "",
    Telefono: "",
    Activo: true,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openModal, setOpenModal] = useState(false); 
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Nuevo estado
  const [userToDelete, setUserToDelete] = useState(null); // Usuario a eliminar
  const [openEditModal, setOpenEditModal] = useState(false);

  // Función para cargar los usuarios
  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data.Result);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Crear un nuevo usuario
  const handleCreateUser = async () => {
    try {
      const response = await createUsuario(newUser);
      if (response.HttpCode === 200 && !response.HasError) {
        await fetchUsuarios();
        setSnackbarMessage(response.Message || "Usuario creado con éxito");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenModal(false); 
        setNewUser({ Nombres: "", Apellidos: "", Correo: "", Contra: "", Telefono: "", Activo: true });
      } else {
        setSnackbarMessage(response.Message || "Error al crear el usuario");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setSnackbarMessage("Error al crear el usuario");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Actualizar el estado de un usuario
  const handleUpdateUserStatus = async (id, status) => {
    try {
      const response = await updateUsuarioStatus(id, status);
      if (response.HttpCode === 200 && !response.HasError) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.Id === id ? { ...usuario, Activo: status } : usuario
          )
        );
        setSnackbarMessage(status ? "Usuario activado" : "Usuario desactivado");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(response.Message || "Error al actualizar el estado");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
      setSnackbarMessage("Error al actualizar el estado");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Eliminar un usuario
  const handleDeleteUser = async () => {
    try {
      const response = await deleteUsuario(userToDelete);
      if (response.HttpCode === 200 && !response.HasError) {
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.Id !== userToDelete));
        setSnackbarMessage("Usuario eliminado");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(response.Message || "Error al eliminar el usuario");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setSnackbarMessage("Error al eliminar el usuario");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false); // Cerrar diálogo después de eliminar
  };

  // Cerrar el Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Función para abrir el modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Abrir el diálogo de confirmación de eliminación
  const handleOpenDeleteDialog = (id) => {
    setUserToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Cerrar el diálogo de confirmación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleOpenEditModal = (usuario) => {
    setEditUser(usuario); // Cargar usuario para editar
    setOpenEditModal(true); // Abrir el modal
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);  // Close the modal
  };

  const handleUpdateUser = async () => {
    try {
      const response = await updateUsuario(editUser);
      if (response.HttpCode === 200 && !response.HasError) {
        setSnackbarMessage("Usuario actualizado");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenEditModal(false);  // Close the modal after updating
        await fetchUsuarios();  // Refresh the user list
      } else {
        setSnackbarMessage(response.Message || "Error al actualizar el usuario");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setSnackbarMessage("Error al actualizar el usuario");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Catálogo de Usuarios
      </Typography>

      {/* Botón para abrir el modal */}
        <Box display="flex" gap={2} marginBottom={2}>
            {/* Botón Agregar Usuario con Icono */}
            <Button variant="contained" onClick={handleOpenModal} startIcon={<Add />}>
                Agregar Usuario
            </Button>

            {/* Botón Actualizar Lista con Icono */}
            <Button 
                variant="contained" 
                onClick={fetchUsuarios} 
                startIcon={<Sync />}
                >
                Actualizar Lista
            </Button>
        </Box>

      {/* Tabla de usuarios */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.Id}>
                <TableCell>{`${usuario.Nombres} ${usuario.Apellidos}`}</TableCell>
                <TableCell>{usuario.Correo}</TableCell>
                <TableCell>{usuario.Telefono}</TableCell>
                <TableCell>{usuario.Activo ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleOpenEditModal(usuario)} 
                        startIcon={<Edit />}></Button>
                    <Button
                        variant="contained"
                        onClick={() => handleUpdateUserStatus(usuario.Id, !usuario.Activo)}
                        startIcon={usuario.Activo ? <Cancel /> : <Check />} ></Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(usuario.Id)} // Abre el diálogo de confirmación
                        startIcon={<Delete />} ></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para agregar un nuevo usuario */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Agregar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombres"
            fullWidth
            margin="normal"
            value={newUser.Nombres}
            onChange={(e) => setNewUser({ ...newUser, Nombres: e.target.value })}
          />
          <TextField
            label="Apellidos"
            fullWidth
            margin="normal"
            value={newUser.Apellidos}
            onChange={(e) => setNewUser({ ...newUser, Apellidos: e.target.value })}
          />
          <TextField
            label="Correo"
            fullWidth
            margin="normal"
            value={newUser.Correo}
            onChange={(e) => setNewUser({ ...newUser, Correo: e.target.value })}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={newUser.Contra}
            onChange={(e) => setNewUser({ ...newUser, Contra: e.target.value })}
          />
          <TextField
            label="Teléfono"
            fullWidth
            margin="normal"
            value={newUser.Telefono}
            onChange={(e) => setNewUser({ ...newUser, Telefono: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCreateUser} color="primary">
            Crear Usuario
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este usuario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>


        <Dialog open={openEditModal} onClose={handleCloseEditModal}>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nombres"
                    fullWidth
                    margin="normal"
                    value={editUser.Nombres}
                    onChange={(e) => setEditUser({ ...editUser, Nombres: e.target.value })}
                    />
                <TextField
                    label="Apellidos"
                    fullWidth
                    margin="normal"
                    value={editUser.Apellidos}
                    onChange={(e) => setEditUser({ ...editUser, Apellidos: e.target.value })}
                    />
                <TextField
                    label="Teléfono"
                    fullWidth
                    margin="normal"
                    value={editUser.Telefono}
                    onChange={(e) => setEditUser({ ...editUser, Telefono: e.target.value })}
                    />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEditModal} color="secondary">
                Cancelar
                </Button>
                <Button onClick={handleUpdateUser} color="primary">
                Actualizar Usuario
                </Button>
            </DialogActions>
        </Dialog>

      {/* Snackbar de notificación */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} 
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CatalogoUsuarios;
