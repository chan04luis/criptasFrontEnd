import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    AppBar,
    Toolbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import CustomIconButton from "../../../Utils/CustomIconButton";
import CitasService from "../../../../services/AtencionMedica/CitasService";
import SalaConsultaService from "../../../../services/AtencionMedica/SalaConsultaService";
import { RootObject } from "../../../../entities/Seguridad/RootObject";
import { EntCitaEditable } from "../../../../entities/AtencionMedica/EntCitaEditable";

interface SalaDoctorProps {
    result: RootObject | null;
}

const SalaDoctor: React.FC<SalaDoctorProps> = ({ result }) => {
    const parentConfig = result?.Configuracion;
    const user = result?.Usuario;
    const [loading, setLoading] = useState<boolean>(false);
    const [citas, setCitas] = useState<EntCitaEditable[]>([]);
    const [salaDisponible, setSalaDisponible] = useState<boolean>(false);

    const fetchCitasDoctor = async () => {
        setLoading(true);
        try {
            const response = await CitasService.obtenerCitas({ Estado: "en proceso" });
            if (!response.HasError) {
                setCitas(response.Result || []);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar las citas.");
        } finally {
            setLoading(false);
        }
    };

    const verificarSalaDisponible = async () => {
        try {
            if (result?.Sucursales[0]?.Id != undefined) {
                const response = await SalaConsultaService.obtenerSalasDisponibles(result?.Sucursales[0].Id);
                if (!response.HasError && response.Result.length > 0 && response.Result.find(x => x.idDoctor == localStorage.getItem("authId"))) {
                    setSalaDisponible(true);
                    return true;
                } else {
                    setSalaDisponible(false);
                }
            }
            return false;
        } catch (error) {
            setSalaDisponible(false);
            return false;
        }
    };

    const abrirSalaConsulta = async () => {
        const isSalaDisponible = await verificarSalaDisponible();
        if (!isSalaDisponible && result?.Sucursales[0]?.Id != undefined) {
            setLoading(true);
            const response = await SalaConsultaService.registrarEntradaConsulta(result?.Sucursales[0].Id);
            if (response.HasError) {
                toast.error(response.Message || "Error al abrir la sala.");
            } else {
                toast.success("Sala de consulta abierta con éxito.");
                setSalaDisponible(true);
            }
        }
        else {

        }
        setLoading(false);
    };

    const handleRegistrarLlegada = async (idCita: string) => {
        if (!salaDisponible) {
            toast.warn("No hay una sala de consulta abierta.");
            return;
        }
        setLoading(true);
        const response = await CitasService.registrarLlegada(idCita);
        if (response.HasError) {
            toast.error(response.Message || "Error al registrar llegada.");
        } else {
            toast.success("Paciente ha llegado.");
            fetchCitasDoctor();
        }
        setLoading(false);
    };

    const handleRegistrarSalida = async (idCita: string) => {
        setLoading(true);
        const response = await CitasService.registrarSalida(idCita);
        if (response.HasError) {
            toast.error(response.Message || "Error al registrar salida.");
        } else {
            toast.success("Paciente ha salido.");
            fetchCitasDoctor();
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCitasDoctor();
        setTimeout(async () => {
            verificarSalaDisponible();
        }, 500);
    }, []);

    return (
        <Box sx={{ width: "100%", backgroundColor: "#f2f2f2", minHeight: "90vh" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Sala del Doctor
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <CustomIconButton onClick={fetchCitasDoctor} title="Refrescar">
                            <RefreshIcon />
                        </CustomIconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Paper elevation={3} sx={{ margin: 2, padding: 2 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {!salaDisponible && (
                            <Box sx={{ textAlign: "center", padding: 2 }}>
                                <Typography variant="h6" color="error">
                                    No hay una sala de consulta abierta.
                                </Typography>
                                <CustomIconButton onClick={abrirSalaConsulta} title="Abrir Sala de Consulta">
                                    🏥
                                </CustomIconButton>
                            </Box>
                        )}

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: parentConfig?.ColorPrimario || "#1976d2" }}>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Paciente</TableCell>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Sucursal</TableCell>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Servicio</TableCell>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Turno</TableCell>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {citas.map((cita) => (
                                        <TableRow key={cita.Id}>
                                            <TableCell>{cita.Cliente}</TableCell>
                                            <TableCell>{cita.Sucursal}</TableCell>
                                            <TableCell>{cita.Servicio}</TableCell>
                                            <TableCell>{cita.Turno}</TableCell>
                                            <TableCell>
                                                {(!cita.RegistradoEnPiso && cita.Estado != "en proceso") && (
                                                    <IconButton
                                                        onClick={() => handleRegistrarLlegada(cita.Id)}
                                                        title="Registrar Llegada"
                                                        sx={{ color: "blue" }}
                                                    >
                                                        🚶
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    onClick={() => handleRegistrarSalida(cita.Id)}
                                                    title="Registrar Salida"
                                                    sx={{ color: "black" }}
                                                >
                                                    🚪
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default SalaDoctor;
