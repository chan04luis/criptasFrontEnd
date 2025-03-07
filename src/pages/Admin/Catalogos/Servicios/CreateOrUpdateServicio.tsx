import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import UploadImage from "../../../Utils/UploadImage";
import "react-quill/dist/quill.snow.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { EntServicios } from "../../../../entities/Catalogos/servicios/EntServicios";
import { Height } from "@mui/icons-material";
import UploadTwoImages from "../../../Utils/UploadTwoImages";

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
}

const CreateOrUpdateServicio: React.FC<CreateOrUpdateServicioProps> = ({
    servicio,
    setServicio,
    onSave
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

            <UploadTwoImages
                imageTitle="Imagen del servicio"
                imageBase64={servicio.Img}
                setImageBase64={(base1, base2) => setServicio({ ...servicio, Img: base1, ImgPreview: base2 })}
                previewBase64={servicio.ImgPreview}
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
