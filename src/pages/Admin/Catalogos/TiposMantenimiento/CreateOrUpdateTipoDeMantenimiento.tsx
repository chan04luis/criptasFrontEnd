import React from "react";
import { Box, TextField } from "@mui/material";
import UploadImage from "../../../Utils/UploadImage";
import { EntTipoDeMantenimiento } from "../../../../entities/catalogos/tipo_mantenimientos/EntTipoDeMantenimiento";

interface CreateOrUpdateTipoDeMantenimientoProps {
    mantenimiento: EntTipoDeMantenimiento;
    setMantenimiento: (mantenimiento: EntTipoDeMantenimiento) => void;
    onSave: () => void;
}

const CreateOrUpdateTipoDeMantenimiento: React.FC<CreateOrUpdateTipoDeMantenimientoProps> = ({
    mantenimiento,
    setMantenimiento,
    onSave,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMantenimiento({ ...mantenimiento, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }} sx={{ padding: 2 }}>
            <TextField
                label="Nombre"
                name="Nombre"
                value={mantenimiento.Nombre}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Descripción"
                name="Descripcion"
                value={mantenimiento.Descripcion}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginTop: 2 }}
            />
            <TextField
                label="Costo"
                name="Costo"
                type="number"
                value={mantenimiento.Costo}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginTop: 2 }}
            />

            {/* Componente de UploadImage */}
            <UploadImage
                imageTitle="Imagen del mantenimiento"
                imageBase64={mantenimiento.Img || null}
                setImageBase64={(base64) => setMantenimiento({ ...mantenimiento, Img: base64 })}
            />
        </Box>
    );
};

export default CreateOrUpdateTipoDeMantenimiento;
