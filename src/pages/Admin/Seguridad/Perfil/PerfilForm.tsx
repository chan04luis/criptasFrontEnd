import React from "react";
import { Box, TextField, Switch, FormControlLabel } from "@mui/material";
import { Perfil } from "../../../../entities/Seguridad/Perfil";

interface PerfilFormProps {
  data: Perfil;
  onChange: (data: Perfil) => void;
}

const PerfilForm: React.FC<PerfilFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ ...data, [name]: checked });
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: "1fr",
        padding: 2,
      }}
    >
      <TextField
        label="Clave del Perfil"
        name="ClavePerfil"
        value={data.ClavePerfil}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Nombre del Perfil"
        name="NombrePerfil"
        value={data.NombrePerfil}
        onChange={handleChange}
        fullWidth
        required
      />
      { data.IdPerfil == '' && (<FormControlLabel
        control={
          <Switch
            name="Eliminable"
            checked={data.Eliminable}
            onChange={handleSwitchChange}
          />
        }
        label="Eliminable"
      />)}
      
    </Box>
  );
};

export default PerfilForm;
