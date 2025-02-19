import React, { useEffect, useState } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import UploadImage from "../../../Utils/UploadImage";
import "react-quill/dist/quill.snow.css";
import { EntServicios } from "../../../../entities/catalogos/servicios/EntServicios";
import { Iglesia } from "../../../../entities/catalogos/iglesias/Iglesia";

let ReactQuill: any = null; // Se inicializa null para evitar SSR issues en Vite

if (typeof window !== "undefined") {
    import("react-quill").then((mod) => {
        ReactQuill = mod.default;
    });
}

interface CreateOrUpdateServicioProps {
    servicio: EntServicios;
    setServicio: (servicio: EntServicios) => void;
    onSave: () => void;
    iglesias: Iglesia[];
    loading: boolean;
}

const CreateOrUpdateServicio: React.FC<CreateOrUpdateServicioProps> = ({
    servicio,
    setServicio,
    onSave,
    iglesias,
    loading
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServicio({ ...servicio, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }} sx={{ padding: 2 }}>
            <TextField
                label="Nombre"
                name="Nombre"
                value={servicio.Nombre}
                onChange={handleChange}
                fullWidth
                required
            />

            <Autocomplete
                sx={{ mt: 2 }}
                options={iglesias}
                getOptionLabel={(option) => option.Nombre || ""}
                value={iglesias.find((ig) => ig.Id === servicio.IdIglesia) || null}
                onChange={(_, newValue) => setServicio({ ...servicio, IdIglesia: newValue?.Id || "" })}
                loading={loading}
                renderInput={(params) => <TextField {...params} label="Seleccionar Iglesia" fullWidth />}
            />

            <UploadImage
                imageTitle="Imagen del servicio"
                imageBase64={servicio.Img ?? null}
                setImageBase64={(base64) => setServicio({ ...servicio, Img: base64 ?? null })}
            />

            {mounted && ReactQuill && (
                <Box sx={{ marginTop: 2, mb: 2, height: "300px" }}>
                    <ReactQuill
                        theme="snow"
                        value={servicio.Descripcion || ""}
                        onChange={(content: string) => setServicio({ ...servicio, Descripcion: content })}
                        modules={{
                            clipboard: { matchVisual: false },
                        }}
                        style={{ height: "100%" }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CreateOrUpdateServicio;
