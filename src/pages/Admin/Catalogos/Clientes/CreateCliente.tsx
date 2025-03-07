import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ClienteCreatePayload } from "../../../../entities/Cliente";

interface CreateClienteProps {
  cliente: ClienteCreatePayload;
  setCliente: (cliente: ClienteCreatePayload) => void;
  onSave: () => void;
}

const CreateCliente: React.FC<CreateClienteProps> = ({ cliente, setCliente, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
    if (e.target.name == "FechaNac") {
      const v = formatDateS(e.target.value);
      if (v != undefined) {
        setCliente({ ...cliente, ["FechaNac"]: e.target.value.slice(0, 10) });
        setCliente({ ...cliente, ["FechaNacD"]: v });
      }
    }
  };

  const formatDateS = (date: string | undefined) => {
    if (!date) return undefined;
    return new Date(date);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setCliente({ ...cliente, Sexo: e.target.value });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, display: "grid", gap: 2 }}>
      <TextField label="Nombres" name="Nombres" value={cliente.Nombres} onChange={handleChange} fullWidth required
        slotProps={{
          inputLabel: { shrink: true },
        }} />
      <TextField label="Apellidos" name="Apellidos" value={cliente.Apellidos} onChange={handleChange} fullWidth required
        slotProps={{
          inputLabel: { shrink: true },
        }} />
      <TextField label="Dirección" name="Direccion" value={cliente.Direccion} onChange={handleChange} fullWidth required
        slotProps={{
          inputLabel: { shrink: true },
        }} />
      <TextField label="Fecha de Nacimiento" name="FechaNac" type="date" value={formatDate(cliente.FechaNacD)} onChange={handleChange} fullWidth required
        slotProps={{
          inputLabel: { shrink: true },
        }} />
      <FormControl fullWidth required>
        <InputLabel>Sexo</InputLabel>
        <Select
          name="Sexo"
          value={cliente.Sexo}
          onChange={handleSelectChange}
        >
          <MenuItem value="Hombre">Hombre</MenuItem>
          <MenuItem value="Mujer">Mujer</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Teléfono" name="Telefono" value={cliente.Telefono} onChange={handleChange} fullWidth required
        slotProps={{
          inputLabel: { shrink: true },
        }} />
      <TextField label="Correo Electrónico" name="Email" value={cliente.Email} onChange={handleChange} fullWidth required
        slotProps={{
          inputLabel: { shrink: true },
        }} />
    </Box>
  );
};

export default CreateCliente;
