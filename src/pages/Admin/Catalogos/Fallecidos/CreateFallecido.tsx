import React from "react";
import { Box, TextField } from "@mui/material";
import { EntFallecidosRequest } from "../../../../entities/catalogos/fallecidos/EntFallecidosRequest";

interface CreateFallecidoProps {
    fallecido: EntFallecidosRequest;
    setFallecido: (fallecido: EntFallecidosRequest) => void;
    onSave: () => void;
}

const CreateFallecido: React.FC<CreateFallecidoProps> = ({ fallecido, setFallecido, onSave }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFallecido({ ...fallecido, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }} sx={{ padding: 2 }}>
            <TextField label="Nombre" name="Nombre" value={fallecido.Nombre} onChange={handleChange} fullWidth required />
            <TextField label="Apellidos" name="Apellidos" value={fallecido.Apellidos} onChange={handleChange} fullWidth required sx={{ marginTop: 2 }} />
            <TextField
                label="Fecha Nacimiento"
                name="Nacimiento"
                type="date"
                value={fallecido.Nacimiento ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginTop: 2 }}
                slotProps={{
                    inputLabel: { shrink: true },
                }}
            />

            <TextField
                label="Fecha Fallecimiento"
                name="Fallecimiento"
                type="date"
                value={fallecido.Fallecimiento ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginTop: 2 }}
                slotProps={{
                    inputLabel: { shrink: true },
                }}
            />

        </Box>
    );
};

export default CreateFallecido;
