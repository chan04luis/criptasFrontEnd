import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { CitasFiltroRequest } from "../../../entities/AtencionMedica/CitasFiltroRequest";
import { EntCitaEditable } from "../../../entities/AtencionMedica/EntCitaEditable";
import CitasService from "../../../services/AtencionMedica/CitasService";


const CitasComponent: React.FC = () => {
    const [citas, setCitas] = useState<EntCitaEditable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        cargarCitas();
    }, []);

    const cargarCitas = async () => {
        setLoading(true);
        setError(null);
        try {
            const filtro: CitasFiltroRequest = { Estado: "pendiente" };
            const response = await CitasService.obtenerCitas(filtro);
            if (!response.HasError && response.Result) {
                setCitas(response.Result);
            } else {
                setError(response.Message || "Error al obtener citas.");
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const atenderCita = async (id: String, idSucursal: string) => {
        setLoading(true);
        try {
            const response = await CitasService.atenderTurno(id, idSucursal);
            if (!response.HasError) {
                cargarCitas(); // Recargar citas después de atender una
            } else {
                setError(response.Message);
            }
        } catch (err) {
            setError("Error al atender cita.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Gestión de Citas
            </Typography>
            <Button variant="contained" color="primary" onClick={cargarCitas} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Recargar Citas"}
            </Button>

            {error && <Typography color="error">{error}</Typography>}

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Sucursal</TableCell>
                            <TableCell>Servicio</TableCell>
                            <TableCell>Doctor</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {citas.length > 0 ? (
                            citas.map((cita) => (
                                <TableRow key={cita.Id}>
                                    <TableCell>{cita.Cliente}</TableCell>
                                    <TableCell>{cita.Sucursal}</TableCell>
                                    <TableCell>{cita.Servicio}</TableCell>
                                    <TableCell>{cita.Doctor || "Sin asignar"}</TableCell>
                                    <TableCell>{new Date(cita.FechaCita).toLocaleString()}</TableCell>
                                    <TableCell>{cita.Estado}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="success" onClick={() => atenderCita(cita.Id, cita.IdSucursal)}>
                                            Atender
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay citas disponibles.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CitasComponent;
