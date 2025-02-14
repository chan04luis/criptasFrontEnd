import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    IconButton,
    CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { PagoParcialidad } from "../../../../entities/Administracion/Pagos/PagoParcialidad";
import { PagoLista } from "../../../../entities/Administracion/Pagos/PagoLista";
import PagosService from "../../../../services/Administracion/PagosService";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Utils/ConfirmModal";

interface PagoParcialidadModalProps {
    open: boolean;
    pago: PagoLista | null;
    setPagoSeleccionado: React.Dispatch<React.SetStateAction<PagoLista | null>>;
    onClose: () => void;
    pagosParciales: PagoParcialidad[];
    reloadPagosParciales: () => void;
}

const PagoParcialidadModal: React.FC<PagoParcialidadModalProps> = ({
    open,
    onClose,
    pagosParciales,
    pago,
    reloadPagosParciales,
    setPagoSeleccionado
}) => {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [selected, setSelected] = useState<PagoParcialidad | null>(null);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const handleDelete = async () => {
        if (selected) {
            setLoadingId(selected.Id);
            try {
                const response = await PagosService.deleteParcialidad(selected.Id);
                if (!response.HasError) {
                    if (pago) {
                        setPagoSeleccionado((prev) => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                MontoPagado: pago.MontoPagado - selected.Monto,
                            };
                        });
                    }
                    toast.success("Pago desaplicado con éxito.");
                    reloadPagosParciales();
                } else {
                    toast.error(response.Message || "Error al desaplicar el pago.");
                }
            } catch (error) {
                toast.error("Ocurrió un error al desaplicar el pago.");
            } finally {
                setLoadingId(null);
            }
        }
        setOpenConfirmModal(false);
    };
    const handleDesaplicarPago = async (parcial: PagoParcialidad) => {
        setSelected(parcial);
        setOpenConfirmModal(true);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Detalle de Pagos Parciales: ${pago?.MontoPagado.toFixed(2) ?? 0} de ${pago?.MontoTotal.toFixed(2) ?? 0}</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Monto</TableCell>
                                <TableCell>Fecha de Pago</TableCell>
                                <TableCell>Estatus</TableCell>
                                {!pago?.Pagado && <TableCell>Acciones</TableCell>} {/* Solo muestra acciones si el pago NO está pagado */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pagosParciales.length > 0 ? (
                                pagosParciales.map((pagoParcial) => (
                                    <TableRow key={pagoParcial.Id}>
                                        <TableCell>${pagoParcial.Monto.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(pagoParcial.FechaPago).toLocaleDateString()}</TableCell>
                                        <TableCell>{pagoParcial.Estatus ? "Activo" : "Inactivo"}</TableCell>
                                        {!pago?.Pagado && (
                                            <TableCell>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDesaplicarPago(pagoParcial)}
                                                    disabled={loadingId === pagoParcial.Id}
                                                >
                                                    {loadingId === pagoParcial.Id ? <CircularProgress size={24} /> : <DeleteIcon />}
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No hay pagos parciales registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ConfirmModal
                    open={openConfirmModal}
                    onClose={() => setOpenConfirmModal(false)}
                    onConfirm={handleDelete}
                    title="Confirmar eliminación"
                    message="¿Estás seguro de que deseas eliminar este pago?"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PagoParcialidadModal;
