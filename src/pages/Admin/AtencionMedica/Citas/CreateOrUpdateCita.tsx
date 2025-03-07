import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, CircularProgress } from "@mui/material";
import { EntCitaEditable } from "../../../../entities/AtencionMedica/EntCitaEditable";
import ClienteService from "../../../../services/Catalogo/ClienteService";
import ServiciosService from "../../../../services/Catalogo/ServiciosService";
import SucursalService from "../../../../services/Catalogo/SucursalService";
import UserService from "../../../../services/UserService";
import { toast } from "react-toastify";
import { IdPerfilDoctor } from "../../../../config/globals";

interface CreateOrUpdateCitaProps {
    cita: EntCitaEditable;
    setCita: (cita: EntCitaEditable) => void;
    onSave: () => void;
}

const CreateOrUpdateCita: React.FC<CreateOrUpdateCitaProps> = ({ cita, setCita, onSave }) => {
    const [clientes, setClientes] = useState<{ Id: string; Nombres: string }[]>([]);
    const [sucursales, setSucursales] = useState<{ Id: string; Nombre: string }[]>([]);
    const [servicios, setServicios] = useState<{ Id: string; Nombre: string }[]>([]);
    const [doctores, setDoctores] = useState<{ Id: string; Nombre: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            console.log(cita)
            setLoading(true);
            try {
                const clientesResponse = await ClienteService.getClientesList();
                const sucursalesResponse = await SucursalService.getSucursales();
                const serviciosResponse = await ServiciosService.getList();
                const doctoresResponse = await UserService.getUsersByFilters({ IdPerfil: IdPerfilDoctor });

                if (!clientesResponse.HasError) setClientes(clientesResponse.Result || []);
                if (!sucursalesResponse.HasError) setSucursales(sucursalesResponse.Result || []);
                if (!serviciosResponse.HasError) setServicios(serviciosResponse.Result || []);
                if (!doctoresResponse.HasError) {
                    setDoctores(doctoresResponse.Result.map((doc) => ({
                        Id: doc.Id,
                        Nombre: `${doc.Nombres} ${doc.Apellidos || ""}`.trim()
                    })));
                }
            } catch (error) {
                toast.error("Error al cargar datos");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCita({ ...cita, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }} sx={{ padding: 2 }}>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TextField
                        label="Cliente"
                        name="IdCliente"
                        select
                        value={cita.IdCliente || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mt: 2 }}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    >
                        {clientes.map((cliente) => (
                            <MenuItem key={cliente.Id} value={cliente.Id}>
                                {cliente.Nombres}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Sucursal"
                        name="IdSucursal"
                        select
                        value={cita.IdSucursal || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mt: 2 }}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    >
                        {sucursales.map((sucursal) => (
                            <MenuItem key={sucursal.Id} value={sucursal.Id}>
                                {sucursal.Nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Servicio"
                        name="IdServicio"
                        select
                        value={cita.IdServicio || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mt: 2 }}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    >
                        {servicios.map((servicio) => (
                            <MenuItem key={servicio.Id} value={servicio.Id}>
                                {servicio.Nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Doctor"
                        name="IdDoctor"
                        select
                        value={cita.IdDoctor || ""}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    >
                        <MenuItem value="">Sin doctor asignado</MenuItem>
                        {doctores.map((doctor) => (
                            <MenuItem key={doctor.Id} value={doctor.Id}>
                                {doctor.Nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Fecha de la Cita"
                        name="FechaCita"
                        type="datetime-local"
                        value={cita.FechaCita || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mt: 2 }}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    />
                </>
            )}
        </Box>
    );
};

export default CreateOrUpdateCita;
