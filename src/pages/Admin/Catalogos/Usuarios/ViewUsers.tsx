import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { User } from '../../../../entities/User';
import UserService from '../../../../services/UserService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ViewUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado para eliminar
  const [dialogOpen, setDialogOpen] = useState<boolean>(false); // Controla la visibilidad del diálogo
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Mostrar indicador de carga
      try {
        const response = await UserService.getUsersByFilters({
          Id: '',
          Nombres: '',
          Apellidos: '',
          Estatus: true,
        });
        if (response.HasError) {
          toast.error(response.Message);
        } else {
          setUsers(response.Result || []);
        }
      } catch (error) {
        toast.error('Hubo un error al cargar los usuarios');
      } finally {
        setLoading(false); 
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    // Mostrar indicador de carga
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <p style={{ marginLeft: '10px' }}>Cargando usuarios...</p>
      </div>
    );
  }

  const handleCreateUser = () => {
    navigate('/admin/usuarios/crear');
  };

  const handleEditUser = (id: string) => {
    navigate(`/admin/usuarios/editar/${id}`); // Redirige al formulario de edición con el ID
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await UserService.deleteUser(selectedUser.Id);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success('Usuario eliminado con éxito');
        setUsers((prevUsers) => prevUsers.filter((user) => user.Id !== selectedUser.Id)); // Actualiza la lista de usuarios
      }
    } catch (error) {
      toast.error('Hubo un error al eliminar el usuario');
    } finally {
      setDialogOpen(false); // Cierra el diálogo
      setSelectedUser(null); // Limpia el usuario seleccionado
    }
  };

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user); // Almacena el usuario seleccionado
    setDialogOpen(true); // Abre el diálogo
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Cierra el diálogo
    setSelectedUser(null); // Limpia el usuario seleccionado
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '16px' }}
        onClick={handleCreateUser}
      >
        Crear Usuario
      </Button>
      {users.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombres</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.Id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{user.Nombres}</TableCell>
                  <TableCell>{user.Apellidos}</TableCell>
                  <TableCell>{user.Correo}</TableCell>
                  <TableCell>{user.Telefono}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginRight: '10px' }}
                      onClick={() => handleEditUser(user.Id)} // Enviar ID al botón "Editar"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenDialog(user)} // Abre el diálogo de confirmación
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p style={{ textAlign: 'center' }}>No hay usuarios disponibles</p>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al usuario <b>{selectedUser?.Nombres} {selectedUser?.Apellidos}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="secondary" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewUsers;
