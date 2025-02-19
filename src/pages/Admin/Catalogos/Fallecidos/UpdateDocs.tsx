import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { EntFallecidos } from "../../../../entities/catalogos/fallecidos/EntFallecidos";
import UploadImage from "../../../Utils/UploadImage";
import FallecidosService from "../../../../services/Catalogos/FallecidosService";
import { toast } from "react-toastify";

interface UpdateDocsProps {
    fallecido: EntFallecidos;
    setLoading: (i: boolean) => void;
    loading: boolean;
    setFallecido: (fallecido: EntFallecidos | null) => void;
    onSave: () => void;
}

const UpdateDocs: React.FC<UpdateDocsProps> = ({ fallecido, setFallecido, onSave, loading, setLoading }) => {
    const fecthDocs = async () => {
        setLoading(true);
        if (!fallecido.Id) return;
        try {
            const response = await FallecidosService.getSingle(fallecido.Id);
            if (!response.HasError) {
                setFallecido(response.Result || null);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar los fallecidos.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fecthDocs();
    }, []);

    return (
        !loading ? (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }} sx={{ padding: 2 }}>
                <UploadImage
                    imageTitle="Acta de Defunción"
                    imageBase64={fallecido.ActaDefuncion || null}
                    setImageBase64={(base64) => setFallecido({ ...fallecido, ActaDefuncion: base64 })}
                />
                <UploadImage
                    imageTitle="Autorización de Incineración"
                    imageBase64={fallecido.AutorizacionIncineracion || null}
                    setImageBase64={(base64) => setFallecido({ ...fallecido, AutorizacionIncineracion: base64 })}
                />
                <UploadImage
                    imageTitle="Autorización de Traslado"
                    imageBase64={fallecido.AutorizacionTraslado || null}
                    setImageBase64={(base64) => setFallecido({ ...fallecido, AutorizacionTraslado: base64 })}
                />
            </Box>)
            : (<Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                <CircularProgress />
            </Box>)
    );
};

export default UpdateDocs;
