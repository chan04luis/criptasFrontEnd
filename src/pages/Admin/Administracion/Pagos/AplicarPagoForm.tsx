import React, { useState } from "react";
import { TextField } from "@mui/material";
import GenericFormModal from "../../../Utils/GenericFormModal";
import { PagosService } from "../../../../services/Administracion/PagosService";
import { PagoAplicar } from "../../../../entities/Administracion/Pagos/PagoAplicar";
import { toast } from "react-toastify";
import { PagoLista } from "../../../../entities/Administracion/Pagos/PagoLista";

interface AplicarPagoFormProps {
    open: boolean;
    onClose: () => void;
    pago: PagoLista | null;
    onSuccess: () => void;
}

const AplicarPagoForm: React.FC<AplicarPagoFormProps> = ({ open, onClose, pago, onSuccess }) => {
    const [montoPagado, setMontoPagado] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!pago) return;
        if ((montoPagado ?? 0) <= 0) {
            toast.warn("Debes agregar un monto mayor a $0.00");
            return;
        }
        if (pago.ClavePago == "PUE" && (montoPagado ?? 0) != pago.MontoTotal) {
            setMontoPagado(pago.MontoTotal);
            toast.warn("En pago de una sola exhibición el pago no puede ser diferente al pago total");
            return;
        } else if (((montoPagado ?? 0) + (pago.MontoPagado ?? 0)) > pago.MontoTotal) {
            setMontoPagado(pago.MontoTotal - (pago.MontoPagado ?? 0));
            toast.warn("El pago no puede exceder al pago faltante");
            return;
        }
        setIsLoading(true);
        const payload: PagoAplicar = { IdPago: pago.Id, MontoPagado: montoPagado };

        try {
            const response = await PagosService.aplicarPago(payload);
            if (!response.HasError) {
                toast.success("Pago aplicado con éxito.");
                onSuccess(); // Recargar lista de pagos
                onClose();   // Cerrar modal
            } else {
                toast.error(response.Message || "Error al aplicar el pago.");
            }
        } catch (error) {
            toast.error("Ocurrió un error al aplicar el pago.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GenericFormModal
            open={open}
            title={`Aplicar Pago - $${(pago?.ClavePago == "PUE") ? pago?.MontoTotal.toFixed(2) : ((pago?.MontoTotal ?? 0) - (pago?.MontoPagado ?? 0)).toFixed(2)}`}
            onClose={onClose}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        >
            <TextField
                label="Monto a Pagar"
                type="number"
                fullWidth
                variant="outlined"
                value={montoPagado}
                onChange={(e) => setMontoPagado(parseFloat(e.target.value) || 0)}
            />
        </GenericFormModal>
    );
};

export default AplicarPagoForm;
