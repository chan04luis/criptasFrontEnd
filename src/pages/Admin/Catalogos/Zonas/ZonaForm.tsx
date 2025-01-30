import React from "react";
import { Box, TextField } from "@mui/material";
import { Zona } from "../../../../entities/catalogos/zonas/Zona";

interface ZonaFormProps {
  zona: Zona;
  setZona: (zona: Zona) => void;
  onSave: () => void;
}

const ZonaForm: React.FC<ZonaFormProps> = ({ zona, setZona, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZona({ ...zona, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <TextField
        label="Nombre de la Zona"
        name="Nombre"
        value={zona.Nombre}
        onChange={handleChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />
    </Box>
  );
};

export default ZonaForm;
