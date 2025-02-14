import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { EntFallecidosUpdateRequest } from "../../../../entities/catalogos/fallecidos/EntFallecidosUpdateRequest";

interface UpdateFallecidoProps {
    fallecido: EntFallecidosUpdateRequest;
    setFallecido: (fallecido: EntFallecidosUpdateRequest | null) => void;
    onSave: () => void;
}

const UpdateFallecido: React.FC<UpdateFallecidoProps> = ({ fallecido, setFallecido, onSave }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFallecido({ ...fallecido, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }} sx={{ padding: 2 }}>
            <TextField label="Nombre" name="Nombre" value={fallecido.Nombre} onChange={handleChange} fullWidth required />
            <TextField label="Apellidos" name="Apellidos" value={fallecido.Apellidos} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }} />
            <TextField label="Fecha Nacimiento" name="Nacimiento" type="date" value={fallecido.Nacimiento} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }} />
            <TextField label="Fecha Fallecimiento" name="Fallecimiento" type="date" value={fallecido.Fallecimiento} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }} />

            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>Actualizar</Button>
        </Box>
    );
};

export default UpdateFallecido;
