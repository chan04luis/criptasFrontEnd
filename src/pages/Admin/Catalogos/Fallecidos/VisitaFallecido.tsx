import React from "react";
import { Box, TextField } from "@mui/material";
import { Visita } from "../../../../entities/catalogos/fallecidos/visita";

interface VisitaFallecidoProps {
    visita: Visita;
    setVisita: (visita: Visita) => void;
    onSave: () => void;
}

const VisitaFallecido: React.FC<VisitaFallecidoProps> = ({ visita, setVisita, onSave }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVisita({ ...visita, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }} sx={{ padding: 2 }}>
            <TextField
                label="Nombre"
                name="NombreVisitante"
                value={visita.NombreVisitante}
                onChange={handleChange}
                fullWidth
                required />
            <TextField
                label="Mensaje"
                name="Mensaje"
                value={visita.Mensaje}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={4}
                sx={{ marginTop: 2 }} />

        </Box>
    );
};

export default VisitaFallecido;
