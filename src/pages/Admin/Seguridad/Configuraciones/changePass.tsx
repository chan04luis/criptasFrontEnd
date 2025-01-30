import React, {  useState } from 'react';
import {
  TextField,
  Typography,
  Paper,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { Configuracion } from '../../../../entities/Seguridad/Configuracion';
import { Usuario } from '../../../../entities/Usuario';
import { UserChangePassPayload } from '../../../../entities/User';
import UserService from '../../../../services/UserService';

interface ChangePassProps {
  parentConfig: Configuracion | undefined;
  user: Usuario | undefined;
}

const ChangePass: React.FC<ChangePassProps> = ({parentConfig, user}) => {
  const [contra, setContra] = useState<UserChangePassPayload>({
    Id: user?.IdUsuario,
    Email: user?.Correo,
    Contra: '',
    NewContra: '',
    ConfirmNewContra: ''
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContra((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await UserService.updateUserPassword(contra);
      if (!response.HasError) {
        toast.success('Contraseña actualizada correctamente');
        setContra({
            Id: user?.IdUsuario,
            Email: user?.Correo,
            Contra: '',
            NewContra: '',
            ConfirmNewContra: ''
          });
      } else {
        toast.error(response.Message);
      }
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f2f2f2',
        minHeight: '90vh',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <AppBar
        position="static"
        sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}
      >
        <Toolbar>
            <Typography
                variant="h6"
                sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}
            >
                {'Cambiar tu contraseña'}
            </Typography>
            <IconButton
                onClick={handleSave}
                title="Guardar"
                sx={{
                backgroundColor: '#ffffff',
                color: '#FF9800',
                borderRadius: '50%',
                padding: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': { backgroundColor: '#f5f5f5' },
                }}
                disabled={loading}
            >
                <SaveIcon />
            </IconButton>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {/* Colores */}
          <Typography variant="subtitle1" sx={{textAlign: "center", fontFamily: "bold", fontSize: "25px"}}>{user?.Nombres} {user?.Apellidos}</Typography>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              type="email"
              disabled={true}
              label="Email"
              name="Email"
              value={user?.Correo}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              type={showPassword.current ? "text" : "password"}
              label="Contraseña actual"
              name="Contra"
              value={contra.Contra}
              onChange={handleChange}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility("current")} edge="end">
                        {!showPassword.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              type={showPassword.new ? "text" : "password"}
              label="Contraseña nueva"
              name="NewContra"
              value={contra.NewContra}
              onChange={handleChange}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility("new")} edge="end">
                        {!showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              type={showPassword.confirm ? "text" : "password"}
              label="Confirmar Contraseña"
              name="ConfirmNewContra"
              value={contra.ConfirmNewContra}
              onChange={handleChange}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility("confirm")} edge="end">
                        {!showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChangePass;
