import React from "react";
import { Box, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { Modulo } from "../../../../entities/Seguridad/Elementos/Modulo";

interface ModuloFormProps {
  formData: Modulo;
  onChange: (field: Modulo) => void; // Callback para manejar los cambios en el formulario
}

const ModuloForm: React.FC<ModuloFormProps> = ({ formData, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        onChange({ ...formData, [name]: value });
      };
    const handleChangeC = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked} = e.target;
        onChange({ ...formData, [name]: checked });
      };
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 0,
      }}
    >
      <TextField
        label="Clave del Módulo"
        name="ClaveModulo"
        value={formData.ClaveModulo}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Nombre del Módulo"
        name="NombreModulo"
        value={formData.NombreModulo}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Ruta del Módulo"
        name="PathModulo"
        value={formData.PathModulo}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            name="MostrarEnMenu"
            checked={formData.MostrarEnMenu}
            onChange={handleChangeC}
          />
        }
        label="Mostrar en Menú"
      />
    </Box>
  );
};

export default ModuloForm;
