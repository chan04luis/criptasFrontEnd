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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import CitasService from "../../../../services/AtencionMedica/CitasService";
import { RootObject } from "../../../../entities/Seguridad/RootObject";
import { EntCitaEditable } from "../../../../entities/AtencionMedica/EntCitaEditable";
import { apiUrl } from "../../../../config/globals";
import CustomIconButton from "../../../Utils/CustomIconButton";

interface SalaEsperaProps {
    result: RootObject | null;
}

const SalaEspera: React.FC<SalaEsperaProps> = ({ result }) => {
    const parentConfig = result?.Configuracion;
    const [loading, setLoading] = useState<boolean>(false);
    const [citas, setCitas] = useState<EntCitaEditable[]>([]);
    const [turnoActual, setTurnoActual] = useState<EntCitaEditable | null>(null);
    const [siguienteTurno, setSiguienteTurno] = useState<EntCitaEditable | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [searchId, setSearchId] = useState<string>("");
    const [connection, setConnection] = useState<HubConnection | null>(null);

    // 📌 Cargar citas
    const fetchCitas = async () => {
        setLoading(true);
        try {
            const response = await CitasService.obtenerCitas({ Estado: "pendiente" });
            if (!response.HasError) {
                setCitas(response.Result || []);
                setTurnoActual(response.Result[0] || null);
                setSiguienteTurno(response.Result[1] || null);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al cargar las citas.");
        } finally {
            setLoading(false);
        }
    };

    // 📌 Marcar llegada del paciente
    const handleRegistrarLlegada = async (idCita: string) => {
        setLoading(true);
        const response = await CitasService.registrarLlegada(idCita);
        if (response.HasError) {
            toast.error(response.Message || "Error al registrar llegada.");
        } else {
            toast.success("Paciente ha llegado.");
            fetchCitas();
            connection?.invoke("ActualizarSalaEspera"); // Notifica a otros usuarios
        }
        setLoading(false);
    };

    // 📌 Buscar cita manualmente en el modal
    const handleSearchCita = async () => {
        if (!searchId) {
            toast.warn("Ingrese un ID de cita.");
            return;
        }
        const response = await CitasService.obtenerCitas({ Id: searchId });
        if (response.HasError || response.Result.length === 0) {
            toast.error("Cita no encontrada.");
        } else {
            handleRegistrarLlegada(response.Result[0].Id);
            setOpenModal(false);
        }
    };

    // 📌 Iniciar conexión con SignalR para recibir actualizaciones en tiempo real
    useEffect(() => {
        const connectToSignalR = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl(`${apiUrl}/SalaEsperaHub`)
                .withAutomaticReconnect()
                .build();

            try {
                await newConnection.start();
                console.log("Conectado a SignalR - Sala de Espera");

                // 📌 Evento para actualizar la lista en tiempo real
                newConnection.on("ActualizarSalaEspera", () => {
                    console.log("🔄 Recibiendo actualización de turnos...");
                    fetchCitas();
                });

                setConnection(newConnection);
            } catch (error) {
                console.error("Error al conectar con SignalR:", error);
            }
        };

        connectToSignalR();
        fetchCitas();

        return () => {
            connection?.stop();
        };
    }, []);

    return (
        <Box sx={{ width: "100%", backgroundColor: "#f2f2f2", minHeight: "90vh" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Sala de Espera
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <CustomIconButton onClick={() => setOpenModal(true)} title="Buscar Cita">
                            <SearchIcon />
                        </CustomIconButton>
                        <CustomIconButton onClick={fetchCitas} title="Refrescar">
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
                        <Typography variant="h6" textAlign="center" color="primary">
                            Turno Actual: {turnoActual ? turnoActual.Turno : "N/A"}
                        </Typography>
                        <Typography variant="subtitle1" textAlign="center">
                            Siguiente Turno: {siguienteTurno ? siguienteTurno.Turno : "N/A"}
                        </Typography>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: parentConfig?.ColorPrimario || "#1976d2" }}>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Turno</TableCell>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Paciente</TableCell>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Servicio</TableCell>
                                        <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {citas.map((cita) => (
                                        <TableRow key={cita.Id}>
                                            <TableCell>{cita.Turno}</TableCell>
                                            <TableCell>{cita.Cliente}</TableCell>
                                            <TableCell>{cita.Servicio}</TableCell>
                                            <TableCell>
                                                {!cita.RegistradoEnPiso && <IconButton onClick={() => handleRegistrarLlegada(cita.Id)} title="Marcar Llegada">
                                                    ✅
                                                </IconButton>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Paper>

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Buscar Cita</DialogTitle>
                <DialogContent>
                    <TextField
                        label="ID de Cita"
                        fullWidth
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button onClick={handleSearchCita} color="primary">Buscar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SalaEspera;
