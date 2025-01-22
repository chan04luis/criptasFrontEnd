import React from "react";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import { Pagina } from "../../../../entities/Seguridad/Elementos/Pagina";

interface PaginaFormProps {
  data: Pagina;
  onChange: (data: Pagina) => void;
}

const PaginaForm: React.FC<PaginaFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange({ ...data, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <>
      <TextField
        label="Clave Página"
        name="ClavePagina"
        value={data.ClavePagina}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nombre Página"
        name="NombrePagina"
        value={data.NombrePagina}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ruta Página"
        name="PathPagina"
        value={data.PathPagina}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="MostrarEnMenu"
            checked={data.MostrarEnMenu}
            onChange={handleChange}
          />
        }
        label="Mostrar en Menú"
      />
    </>
  );
};

export default PaginaForm;
