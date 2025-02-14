import React from "react";
import { Box, TextField } from "@mui/material";
import { EntBeneficiariosRequest } from "../../../../entities/catalogos/beneficiarios/EntBeneficiariosRequest";
import UploadImage from "../../../Utils/UploadImage";

interface CreateBeneficiarioProps {
    beneficiario: EntBeneficiariosRequest;
    setBeneficiario: (beneficiario: EntBeneficiariosRequest) => void;
    onSave: () => void;
}

const CreateBeneficiario: React.FC<CreateBeneficiarioProps> = ({ beneficiario, setBeneficiario, onSave }) => {
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

export default CreateBeneficiario;
