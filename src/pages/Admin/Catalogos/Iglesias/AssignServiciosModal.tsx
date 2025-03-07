import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Box,
    Typography,
} from "@mui/material";
import SucursalService from "../../../../services/Catalogo/SucursalService";
import { EntServicioBySucursal } from "../../../../entities/Catalogos/servicios/EntServicioBySucursal";
import { toast } from "react-toastify";

interface AssignServiciosModalProps {
    open: boolean;
    onClose: () => void;
    sucursalId: string | null;
}

const AssignServiciosModal: React.FC<AssignServiciosModalProps> = ({ open, onClose, sucursalId }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [servicios, setServicios] = useState<EntServicioBySucursal[]>([]);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        if (open && sucursalId) {
            fetchServicios();
        }
    }, [open, sucursalId]);

    const fetchServicios = async () => {
        setLoading(true);
        try {
            if (sucursalId) {
                const response = await SucursalService.getServiciosBySucursal(sucursalId);
                if (!response.HasError) {
                    setServicios(response.Result || []);
                } else {
                    toast.warn(response.Message);
                }
            }
        } catch (error) {
            toast.error("Error al cargar los servicios.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheck = (index: number) => {
        setServicios((prevServicios) =>
            prevServicios.map((servicio, i) =>
                i === index ? { ...servicio, Asignado: !servicio.Asignado } : servicio
            )
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (sucursalId) {
                const response = await SucursalService.setServiciosBySucursal(sucursalId, servicios);
                if (response.HasError) {
                    toast.error(response.Message || "Error al asignar servicios.");
                } else {
                    toast.success("Servicios asignados con éxito.");
                    onClose();
                }
            }
        } catch (error) {
            toast.error("Error al guardar la asignación.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Asignar Servicios</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {servicios.map((servicio, index) => (
                            <Box
                                key={servicio.Id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    padding: 1,
                                    borderRadius: 1,
                                    backgroundColor: servicio.Asignado ? "#e3f2fd" : "#f5f5f5",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleCheck(index)} // Permite hacer clic en toda la fila
                            >
                                <Checkbox
                                    checked={servicio.Asignado}
                                    onChange={(e) => e.stopPropagation()} // Evita que el evento se propague al hacer clic en el checkbox
                                />
                                {servicio.ImgPreview && (
                                    <img
                                        src={servicio.ImgPreview}
                                        alt={servicio.Nombre}
                                        style={{ width: 40, height: 40, borderRadius: 5 }}
                                    />
                                )}
                                <Typography variant="body1" sx={{ flexGrow: 1, color: "#000000" }}>
                                    {servicio.Nombre}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </DialogContent>


            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained" color="primary" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignServiciosModal;
