import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserService from '../../../../services/UserService';
import { UserCreatePayload } from '../../../../entities/User';

const CreateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [isEditMode, setIsEditMode] = useState(false); // Determinar si es edición
  const [userData, setUserData] = useState<UserCreatePayload>({
    Nombres: '',
    Apellidos: '',
    Correo: '',
    Contra: '',
    Telefono: '',
    Activo: true,
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (id) {
      setIsEditMode(true); // Cambiar a modo edición
      const fetchUserData = async () => {
        try {
          const response = await UserService.getUserById(id);
          if (response.HasError) {
            toast.error(response.Message);
          } else {
            setUserData({
              Nombres: response.Result.Nombres,
              Apellidos: response.Result.Apellidos,
              Correo: response.Result.Correo,
              Contra: '', // No mostrar la contraseña
              Telefono: response.Result.Telefono,
              Activo: response.Result.Activo,
            });
          }
        } catch (error) {
          toast.error('Error al cargar los datos del usuario');
        }
      };
      fetchUserData();
    }
  }, [id]);

  const handleCancel = () => {
    navigate('/admin/usuarios');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        var result = null;
      if (isEditMode) {
        result = await UserService.updateUser({
          Id: id!,
          Nombres: userData.Nombres,
          Apellidos: userData.Apellidos,
          Telefono: userData.Telefono,
        });
      } else {
        userData.Correo = userData.Correo?.toLowerCase();
        result = await UserService.createUser(userData);
      }
      if(!result.HasError){
        navigate('/admin/usuarios');
      } 
    } catch (error) {
      toast.error(`Error al ${isEditMode ? 'Actualizar' : 'Crear'} el usuario`);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {isEditMode ? 'Editar Usuario' : 'Crear Usuario'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr' }}>
          <TextField
            label="Nombres"
            name="Nombres"
            value={userData.Nombres}
            onChange={handleChange}
            fullWidth
            disabled={!isEditMode && id !== undefined}
          />
          <TextField
            label="Apellidos"
            name="Apellidos"
            value={userData.Apellidos}
            onChange={handleChange}
            fullWidth
            disabled={!isEditMode && id !== undefined}
          />
          <TextField
            label="Correo"
            name="Correo"
            value={userData.Correo}
            onChange={handleChange}
            fullWidth
            disabled={isEditMode}
          />
          <TextField
            label="Contraseña"
            name="Contra"
            type="password"
            value={userData.Contra}
            onChange={handleChange}
            fullWidth
            disabled={isEditMode}
          />
          <TextField
            label="Teléfono"
            name="Telefono"
            value={userData.Telefono}
            onChange={handleChange}
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? 'Actualizar' : 'Crear'}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="contained"
              color="error"
              startIcon={<ArrowBackIcon />}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </form>
      
    </Box>
  );
};

export default CreateUser;
