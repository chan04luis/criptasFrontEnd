import React from "react";
import { Box, TextField } from "@mui/material";
import { Criptas } from "../../../../entities/catalogos/criptas/Criptas";

interface CriptaFormProps {
  cripta: Criptas;
  setCripta: (cripta: Criptas) => void;
  onSave: () => void;
}

const CriptaForm: React.FC<CriptaFormProps> = ({ cripta, setCripta, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCripta({ ...cripta, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <TextField
        label="Número de Cripta"
        name="Numero"
        value={cripta.Numero}
        onChange={handleChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Ubicación Específica"
        name="UbicacionEspecifica"
        value={cripta.UbicacionEspecifica}
        onChange={handleChange}
        fullWidth
        required
      />
    </Box>
  );
};

export default CriptaForm;
