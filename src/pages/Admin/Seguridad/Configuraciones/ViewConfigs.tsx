import React, { useEffect, useState } from 'react';
import {
  TextField,
  Typography,
  Paper,
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import ConfiguracionService from '../../../../services/Seguridad/ConfiguracionService';
import { Configuracion } from '../../../../entities/Seguridad/Configuracion';

interface ViewConfigsProps {
  parentConfig: Configuracion | undefined; // Configuración recibida del componente padre
}

const ViewConfigs: React.FC<ViewConfigsProps> = ({parentConfig}) => {
  const [config, setConfig] = useState<Configuracion>({
    TituloNavegador: '',
    Titulo: '',
    MetaDescripcion: '',
    ColorPrimario: '',
    ColorSecundario: '',
    ContrastePrimario: '',
    ContrasteSecundario: '',
    UrlFuente: '',
    NombreFuente: '',
    RutaImagenFondo: '',
    RutaImagenLogo: '',
    RutaImagenPortal: '',
  });

  const [loading, setLoading] = useState(false);

  // Cargar configuración desde el servidor
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const response = await ConfiguracionService.getConfiguracion();
        if (!response.HasError) {
          setConfig(response.Result);
        } else {
          toast.error(response.Message);
        }
      } catch (error) {
        toast.error('Error al obtener la configuración');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await ConfiguracionService.updateConfiguracion(config);
      if (!response.HasError) {
        toast.success('Configuración actualizada correctamente');
        window.location.reload();
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
            {config.TituloNavegador || 'Configuración general del sistema'}
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
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {/* Colores */}
          <Typography variant="subtitle1">Colores</Typography>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              type="color"
              label="Color primario"
              name="ColorPrimario"
              value={config.ColorPrimario || "#000000"}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              type="color"
              label="Color secundario"
              name="ColorSecundario"
              value={config.ColorSecundario || "#000000"}
              onChange={handleChange}
              required
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              type="color"
              label="Contraste de color primario"
              name="ContrastePrimario"
              value={config.ContrastePrimario || "#ffffff"}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              type="color"
              label="Contraste de color secundario"
              name="ContrasteSecundario"
              value={config.ContrasteSecundario || "#ffffff"}
              onChange={handleChange}
              required
            />
          </Box>

          {/* Títulos */}
          <Typography variant="subtitle1">Títulos</Typography>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Título o nombre"
              name="Titulo"
              value={config.Titulo || ''}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Título en el navegador"
              name="TituloNavegador"
              value={config.TituloNavegador}
              onChange={handleChange}
              required
            />
          </Box>
          <TextField
            fullWidth
            label="Información"
            name="MetaDescripcion"
            value={config.MetaDescripcion}
            onChange={handleChange}
            required
          />

          {/* Tipografías */}
          <Typography variant="subtitle1">Tipografías</Typography>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="URL de la fuente"
              name="UrlFuente"
              value={config.UrlFuente}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Nombre de la fuente"
              name="NombreFuente"
              value={config.NombreFuente}
              onChange={handleChange}
              required
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewConfigs;
