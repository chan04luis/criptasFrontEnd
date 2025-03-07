import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface UploadTwoImagesProps {
    imageBase64: string | null;
    previewBase64: string | null;
    setImageBase64: (imageBase64: string | null, previewBase64: string | null) => void;
    imageTitle: string;
}

const UploadTwoImages: React.FC<UploadTwoImagesProps> = ({
    imageBase64, setImageBase64,
    previewBase64,
    imageTitle
}) => {
    const [dragging, setDragging] = useState<boolean>(false);
    var base1: string | null = null;
    var base2: string | null = null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            convertToBase64(file);
            createPreviewImage(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            convertToBase64(file);
            createPreviewImage(file);
        }
    };

    // ✅ Convierte la imagen a base64 (manteniendo calidad original)
    const convertToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            base1 = reader.result as string;
            setImageBase64(base1, base2);
        };
        reader.onerror = () => {
            console.error("Error al convertir la imagen a Base64");
        };
    };

    // ✅ Genera una versión reducida para preview
    const createPreviewImage = (file: File) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const maxWidth = 200;
            const maxHeight = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                base2 = compressedBase64;
                setImageBase64(base1, base2);
            }
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
                            src={imageBase64 || previewBase64 || undefined}
                            alt="Imagen subida"
                            style={{ maxWidth: "100%", height: "auto", borderRadius: 5 }}
                        />

                        <IconButton onClick={() => { setImageBase64(null, null); }} sx={{ marginTop: 1, color: "red" }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default UploadTwoImages;
