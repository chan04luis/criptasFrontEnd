import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface UploadImageProps {
    imageBase64: string | null;
    setImageBase64: (image: string | null) => void;
    imageTitle: string; // Se recibe el título desde props
}

const UploadImage: React.FC<UploadImageProps> = ({ imageBase64, setImageBase64, imageTitle }) => {
    const [dragging, setDragging] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            convertToBase64(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files.length > 0) {
            convertToBase64(event.dataTransfer.files[0]);
        }
    };

    const convertToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageBase64(reader.result as string);
        };
        reader.onerror = () => {
            console.error("Error al convertir la imagen a Base64");
        };
    };

    return (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                {imageTitle}
            </Typography>

            <Box
                sx={{
                    border: dragging ? "2px dashed #1976d2" : "2px dashed gray",
                    padding: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: dragging ? "#e3f2fd" : "transparent",
                    borderRadius: 2,
                    position: "relative",
                    width: "100%",
                    maxWidth: "300px",
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                {!imageBase64 ? (
                    <>
                        <CloudUploadIcon sx={{ fontSize: 40, color: "#1976d2" }} />
                        <Typography variant="body1">Arrastra y suelta una imagen aquí</Typography>
                        <Typography variant="body2">o haz clic para seleccionar una</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                opacity: 0,
                                cursor: "pointer",
                                top: 0,
                                left: 0,
                            }}
                        />
                    </>
                ) : (
                    <Box sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img
                            src={imageBase64}
                            alt="Imagen subida"
                            style={{ maxWidth: "100%", height: "auto", borderRadius: 5 }}
                        />
                        <IconButton onClick={() => setImageBase64(null)} sx={{ marginTop: 1, color: "red" }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default UploadImage;
