import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { IglesiaUpdateMaps } from "../../../../entities/catalogos/iglesias/IglesiaUpdateMaps";

interface UpdateIglesiaMapsProps {
  iglesia: IglesiaUpdateMaps;
  setIglesia: (iglesia: IglesiaUpdateMaps) => void;
  onSave: () => void;
}

const UpdateIglesiaMaps: React.FC<UpdateIglesiaMapsProps> = ({ iglesia, setIglesia, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIglesia({ ...iglesia, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <TextField label="Latitud" name="Latitud" value={iglesia.Latitud} onChange={handleChange} fullWidth required />
      <TextField label="Longitud" name="Longitud" value={iglesia.Longitud} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }} />
      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2, width: "100%" }}>
        Guardar Ubicación
      </Button>
    </Box>
  );
};

export default UpdateIglesiaMaps;
