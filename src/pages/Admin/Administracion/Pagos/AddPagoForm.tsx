import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { Cliente } from "../../../../entities/Cliente";
import ClienteSelectionModal from "./ClienteSelectionModal";
import CriptaSelectionModal from "./CriptaSelectionModal";
import { Criptas } from "../../../../entities/catalogos/criptas/Criptas";
import { TipoPagos } from "../../../../entities/Administracion/Pagos/TipoPagos";
import TipoPagosService from "../../../../services/Administracion/TipoPagosService";

interface AddPagoFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const AddPagoForm: React.FC<AddPagoFormProps> = ({ open, onClose, onSave }) => {
    const [fechaLimite, setFechaLimite] = useState<string>("");
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [cripta, setCripta] = useState<Criptas | null>(null);
    const [precio, setPrecio] = useState<number>(0);
    const [idTipoPago, setIdTipoPago] = useState<string>("");
    const [tiposPago, setTiposPago] = useState<TipoPagos[]>([]);

    const [openClienteModal, setOpenClienteModal] = useState<boolean>(false);
    const [openCriptaModal, setOpenCriptaModal] = useState<boolean>(false);

    // Cargar tipos de pago desde el servicio
    useEffect(() => {
        if (open) {
            TipoPagosService.get().then(response => {
                if (!response.HasError) {
                    setTiposPago(response.Result);
                } else {
                    setTiposPago([]);
                }
            });
        }
    }, [open]);

    const handleSave = () => {
        if (!cliente || !cripta || !idTipoPago || precio <= 0 || !fechaLimite) {
            debugger;
            alert("Todos los campos son obligatorios.");
            return;
        }

        onSave({
            IdCliente: cliente.Id,
            IdCripta: cripta.Id,
            IdTipoPago: idTipoPago,
            MontoTotal: precio,
            FechaLimite: fechaLimite,
        });

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Agregar Pago</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Fecha Límite"
                        type="date"
                        value={fechaLimite}
                        onChange={(e) => setFechaLimite(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    {/* Cliente Seleccionado */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {cliente ? (
                            <>
                                <Typography>{cliente.Nombres} {cliente.Apellidos}</Typography>
                                <IconButton color="error" onClick={() => setCliente(null)}>
                                    <Delete />
                                </IconButton>
                            </>
                        ) : (
                            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenClienteModal(true)}>
                                Seleccionar Cliente
                            </Button>
                        )}
                    </Stack>

                    {/* Cripta Seleccionada */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {cripta ? (
                            <>
                                <Typography>{cripta.Numero}</Typography>
                                <IconButton color="error" onClick={() => { setCripta(null); setPrecio(0); }}>
                                    <Delete />
                                </IconButton>
                            </>
                        ) : (
                            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCriptaModal(true)}>
                                Seleccionar Cripta
                            </Button>
                        )}
                    </Stack>

                    {/* Forma de Pago (Cargada desde la API) */}
                    <TextField
                        select
                        label="Forma de Pago"
                        value={idTipoPago}
                        onChange={(e) => setIdTipoPago(e.target.value)}
                        fullWidth
                    >
                        {tiposPago.map((tipo) => (
                            <MenuItem key={tipo.Id} value={tipo.Id}>
                                {tipo.Descripcion}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Precio (Readonly) */}
                    <TextField label="Precio" value={precio} InputProps={{ readOnly: true }} fullWidth />

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Guardar
                </Button>
            </DialogActions>

            {/* Modales de selección */}
            <ClienteSelectionModal
                open={openClienteModal}
                onClose={() => setOpenClienteModal(false)}
                onSelect={(selectedCliente) => {
                    setCliente(selectedCliente);
                    setOpenClienteModal(false);
                }}
            />

            <CriptaSelectionModal
                open={openCriptaModal}
                onClose={() => setOpenCriptaModal(false)}
                onSelect={(selectedCripta) => {
                    setCripta(selectedCripta);
                    setPrecio(selectedCripta.Precio); // Actualiza el precio después de seleccionar
                    setOpenCriptaModal(false);
                }}
            />
        </Dialog>
    );
};

export default AddPagoForm;
