import React from "react"; 
import { Box, TextField } from "@mui/material";
import { Secciones } from "../../../../entities/catalogos/secciones/Secciones";

interface SeccionFormProps {
  seccion: Secciones;
  setSeccion: (seccion: Secciones) => void;
  onSave: () => void;
}

const SeccionForm: React.FC<SeccionFormProps> = ({ seccion, setSeccion, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeccion({ ...seccion, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <TextField
        label="Nombre de la Sección"
        name="Nombre"
        value={seccion.Nombre}
        onChange={handleChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />
    </Box>
  );
};

export default SeccionForm;
