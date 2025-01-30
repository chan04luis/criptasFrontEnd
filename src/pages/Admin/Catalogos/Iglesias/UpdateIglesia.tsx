import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { IglesiaUpdate } from "../../../../entities/catalogos/iglesias/IglesiaUpdate";

interface UpdateIglesiaProps {
  iglesia: IglesiaUpdate;
  setIglesia: (iglesia: IglesiaUpdate) => void;
  onSave: () => void;
}

const UpdateIglesia: React.FC<UpdateIglesiaProps> = ({ iglesia, setIglesia, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIglesia({ ...iglesia, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <TextField label="Nombre" name="Nombre" value={iglesia.Nombre} onChange={handleChange} fullWidth required />
      <TextField label="Dirección" name="Direccion" value={iglesia.Direccion} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }} />
      <TextField label="Ciudad" name="Ciudad" value={iglesia.Ciudad} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }} />
    </Box>
  );
};

export default UpdateIglesia;
