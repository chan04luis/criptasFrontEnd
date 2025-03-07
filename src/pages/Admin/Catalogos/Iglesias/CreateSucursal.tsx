import React from "react";
import { Box, TextField } from "@mui/material";
import { SucursalCreate } from "../../../../entities/Catalogos/sucursales/SucursalCreate";

interface CreateSucursalProps {
  sucursal: SucursalCreate;
  setSucursal: (sucursal: SucursalCreate) => void;
  onSave: () => void;
}

const CreateSucursal: React.FC<CreateSucursalProps> = ({ sucursal, setSucursal, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSucursal({ ...sucursal, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <TextField label="Nombre" name="Nombre" value={sucursal.Nombre} onChange={handleChange} fullWidth required
        slotProps={{
          inputLabel: { shrink: true },
        }} />
      <TextField label="Telefono" name="Telefono" value={sucursal.Telefono} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }}
        slotProps={{
          inputLabel: { shrink: true },
        }} />
      <TextField label="Dirección" name="Direccion" value={sucursal.Direccion} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }}
        slotProps={{
          inputLabel: { shrink: true },
        }} />
      <TextField label="Ciudad" name="Ciudad" value={sucursal.Ciudad} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }}
        slotProps={{
          inputLabel: { shrink: true },
        }} />
    </Box>
  );
};

export default CreateSucursal;
