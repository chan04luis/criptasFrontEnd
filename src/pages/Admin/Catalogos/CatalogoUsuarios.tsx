import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

const CatalogoUsuarios = () => {
  // Aquí puedes agregar más lógica para obtener usuarios desde una API o base de datos.
  const usuarios = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "Ana Gómez" },
    { id: 3, nombre: "Carlos Fernández" },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Catálogo de Usuarios
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Hola Mundo
      </Typography>

      <List>
        {usuarios.map((usuario) => (
          <ListItem key={usuario.id} sx={{ paddingLeft: 0 }}>
            <ListItemText primary={usuario.nombre} />
            <Button variant="contained" color="primary">
              Ver detalles
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CatalogoUsuarios;
