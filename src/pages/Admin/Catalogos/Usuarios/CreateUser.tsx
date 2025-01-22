import React, { useEffect, useState } from "react";
import { Box, TextField, Autocomplete } from "@mui/material";
import { User, UserCreatePayload } from "../../../../entities/User";
import PerfilService from "../../../../services/Seguridad/PerfilService";

interface CreateUserProps {
  user: User | UserCreatePayload ; // Usuario para editar o `null` para crear
  onSave: (userData: UserCreatePayload | User) => void; // Callback para guardar
  setUser: (user: UserCreatePayload | User) => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ user, onSave, setUser }) => {
  const [perfiles, setPerfiles] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const response = await PerfilService.get();
        if (!response.HasError && response.Result) {
          const formattedPerfiles = response.Result.map((perfil) => ({
            id: perfil.IdPerfil,
            label: perfil.NombrePerfil,
          }));
          setPerfiles(formattedPerfiles);
        }
      } catch (error) {
        console.error("Error fetching perfiles:", error);
      }
    };

    fetchPerfiles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(user != undefined)
    onSave(user); 
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 1 }}>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr" }}>
        <TextField
          label="Nombres"
          name="Nombres"
          value={user.Nombres}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Apellidos"
          name="Apellidos"
          value={user.Apellidos}
          onChange={handleChange}
          fullWidth
        />
        <Autocomplete
          options={perfiles}
          getOptionLabel={(option) => option.label}
          value={
            perfiles.find((perfil) => perfil.id === user.IdPerfil) || null
          }
          onChange={(_, newValue) => {
            setUser({
              ...user,
              IdPerfil: newValue?.id || "",
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Perfil" fullWidth />
          )}
          fullWidth
          sx={{ marginY: 2 }}
        />
        <TextField
          label="Correo"
          name="Correo"
          value={user.Correo}
          onChange={handleChange}
          fullWidth
          disabled={("Id" in user)} // El correo no se puede editar en modo edición
        />
        {!("Id" in user) && (
          <TextField
            label="Contraseña"
            name="Contra"
            type="password"
            value={(user as UserCreatePayload).Contra || ""}
            onChange={handleChange}
            fullWidth
          />
        )}
        <TextField
          label="Teléfono"
          name="Telefono"
          value={user.Telefono}
          onChange={handleChange}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default CreateUser;
