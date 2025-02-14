import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import IglesiaService from "../../../../services/Catalogos/IglesiaService";
import IglesiaZonaService from "../../../../services/Catalogos/IglesiaZonaService";
import IglesiaSeccionService from "../../../../services/Catalogos/IglesiaSeccionService";
import CriptasService from "../../../../services/Catalogos/CriptasService";
import { toast } from "react-toastify";
import { Criptas } from "../../../../entities/catalogos/criptas/Criptas";
import { Iglesia } from "../../../../entities/catalogos/iglesias/Iglesia";
import { Secciones } from "../../../../entities/catalogos/secciones/Secciones";
import { Zona } from "../../../../entities/catalogos/zonas/Zona";

interface CriptaSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (cripta: Criptas) => void;
}

const CriptaSelectionModal: React.FC<CriptaSelectionModalProps> = ({
    open,
    onClose,
    onSelect,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [iglesias, setIglesias] = useState<Iglesia[]>([]);
    const [zonas, setZonas] = useState<Zona[]>([]);
    const [secciones, setSecciones] = useState<Secciones[]>([]);
    const [criptas, setCriptas] = useState<Criptas[]>([]);

    const [selectedIglesia, setSelectedIglesia] = useState<string>("");
    const [selectedZona, setSelectedZona] = useState<string>("");
    const [selectedSeccion, setSelectedSeccion] = useState<string>("");

    useEffect(() => {
        if (open) {
            fetchIglesias();
        }
    }, [open]);

    const fetchIglesias = async () => {
        setLoading(true);
        try {
            const response = await IglesiaService.getIglesias();
            if (!response.HasError) {
                setIglesias(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar las iglesias.");
        } finally {
            setLoading(false);
        }
    };

    const fetchZonas = async (iglesiaId: string) => {
        setLoading(true);
        try {
            const response = await IglesiaZonaService.getZonasByIglesia(iglesiaId);
            if (!response.HasError) {
                setZonas(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar las zonas.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSecciones = async (zonaId: string) => {
        setLoading(true);
        try {
            const response = await IglesiaSeccionService.getSeccionesByZona(zonaId);
            if (!response.HasError) {
                setSecciones(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar las secciones.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCriptas = async (seccionId: string) => {
        setLoading(true);
        try {
            const response = await CriptasService.getCriptasDisponiblesBySeccion(seccionId);
            if (!response.HasError) {
                setCriptas(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar las criptas.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Seleccionar Cripta</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress sx={{ display: "block", margin: "auto" }} />
                ) : (
                    <>
                        {/* Selección de Iglesia */}
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Iglesia</InputLabel>
                            <Select
                                value={selectedIglesia}
                                onChange={(e) => {
                                    const iglesiaId = e.target.value;
                                    setSelectedIglesia(iglesiaId);
                                    setSelectedZona("");
                                    setSelectedSeccion("");
                                    setCriptas([]);
                                    fetchZonas(iglesiaId);
                                }}
                            >
                                {iglesias.map((iglesia) => (
                                    <MenuItem key={iglesia.Id} value={iglesia.Id}>
                                        {iglesia.Nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Selección de Zona */}
                        <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedIglesia}>
                            <InputLabel>Zona</InputLabel>
                            <Select
                                value={selectedZona}
                                onChange={(e) => {
                                    const zonaId = e.target.value;
                                    setSelectedZona(zonaId);
                                    setSelectedSeccion("");
                                    setCriptas([]);
                                    fetchSecciones(zonaId);
                                }}
                            >
                                {zonas.map((zona) => (
                                    <MenuItem key={zona.Id} value={zona.Id}>
                                        {zona.Nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Selección de Sección */}
                        <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedZona}>
                            <InputLabel>Sección</InputLabel>
                            <Select
                                value={selectedSeccion}
                                onChange={(e) => {
                                    const seccionId = e.target.value;
                                    setSelectedSeccion(seccionId);
                                    fetchCriptas(seccionId);
                                }}
                            >
                                {secciones.map((seccion) => (
                                    <MenuItem key={seccion.Id} value={seccion.Id}>
                                        {seccion.Nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Selección de Cripta */}
                        <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedSeccion}>
                            <InputLabel>Cripta</InputLabel>
                            <Select
                                value=""
                                onChange={(e) => {
                                    const criptaId = e.target.value;
                                    const criptaSeleccionada = criptas.find(
                                        (c) => c.Id === criptaId
                                    );
                                    if (criptaSeleccionada) {
                                        onSelect(criptaSeleccionada);
                                        onClose();
                                    }
                                }}
                            >
                                {criptas.map((cripta) => (
                                    <MenuItem key={cripta.Id} value={cripta.Id}>
                                        {cripta.Numero} - {cripta.UbicacionEspecifica}{" "}
                                        {cripta.Estatus ? "(Disponible)" : "(No Disponible)"}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CriptaSelectionModal;
