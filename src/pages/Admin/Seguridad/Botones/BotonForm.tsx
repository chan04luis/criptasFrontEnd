import React from "react";
import { TextField } from "@mui/material";
import { Boton } from "../../../../entities/Seguridad/Elementos/Boton";

interface BotonFormProps {
  data: Boton;
  onChange: (data: Boton) => void;
}

const BotonForm: React.FC<BotonFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <>
      <TextField
        label="Clave Botón"
        name="ClaveBoton"
        value={data.ClaveBoton}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nombre Botón"
        name="NombreBoton"
        value={data.NombreBoton}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </>
  );
};

export default BotonForm;
