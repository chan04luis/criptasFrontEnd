import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ClienteUpdatePayload } from "../../../../entities/Cliente";

interface UpdateClienteProps {
  cliente: ClienteUpdatePayload | undefined;
  setCliente: (cliente: ClienteUpdatePayload) => void;
  onSave: () => void;
}

const UpdateCliente: React.FC<UpdateClienteProps> = ({ cliente, setCliente, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(cliente!=undefined)
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
        if(cliente != undefined)
      setCliente({ ...cliente, Sexo: e.target.value });
    };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, display: "grid", gap: 2 }}>
      <TextField label="Nombres" name="Nombres" value={cliente?.Nombres} onChange={handleChange} fullWidth />
      <TextField label="Apellidos" name="Apellidos" value={cliente?.Apellidos} onChange={handleChange} fullWidth />
      <TextField label="Dirección" name="Direccion" value={cliente?.Direccion} onChange={handleChange} fullWidth />
      <TextField label="Fecha de Nacimiento" name="FechaNac" type="date" value={formatDate(cliente?.FechaNac) } onChange={handleChange} fullWidth />
      <FormControl fullWidth required>
        <InputLabel>Sexo</InputLabel>
        <Select
            name="Sexo"
            value={cliente?.Sexo?.toLowerCase()}
            onChange={handleSelectChange}
        >
            <MenuItem value="hombre">Hombre</MenuItem>
            <MenuItem value="mujer">Mujer</MenuItem>
        </Select>
        </FormControl>
      <TextField label="Teléfono" name="Telefono" value={cliente?.Telefono} onChange={handleChange} fullWidth />
      <TextField label="Correo Electrónico" name="Email" value={cliente?.Email} onChange={handleChange} fullWidth />
    </Box>
  );
};

export default UpdateCliente;
