import React from "react";
import { Box, TextField } from "@mui/material";
import { EntBeneficiariosUpdateRequest } from "../../../../entities/catalogos/beneficiarios/EntBeneficiariosUpdateRequest";
import UploadImage from "../../../Utils/UploadImage";

interface UpdateBeneficiarioProps {
    beneficiario: EntBeneficiariosUpdateRequest;
    setBeneficiario: (beneficiario: EntBeneficiariosUpdateRequest | null) => void;
    onSave: () => void;
}

const UpdateBeneficiario: React.FC<UpdateBeneficiarioProps> = ({ beneficiario, setBeneficiario, onSave }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBeneficiario({ ...beneficiario, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }} sx={{ padding: 2 }}>
            <TextField
                label="Nombre"
                name="Nombre"
                value={beneficiario.Nombre}
                onChange={handleChange}
                fullWidth
                required
            />
            <UploadImage
                imageTitle="Frente de la INE"
                imageBase64={beneficiario.IneFrente || null}
                setImageBase64={(base64) => setBeneficiario({ ...beneficiario, IneFrente: base64 })}
            />
            <UploadImage
                imageTitle="Reverso de la INE"
                imageBase64={beneficiario.IneReverso || null}
                setImageBase64={(base64) => setBeneficiario({ ...beneficiario, IneReverso: base64 })}
            />
        </Box>
    );
};

export default UpdateBeneficiario;
