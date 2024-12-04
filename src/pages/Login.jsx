import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password); // Llama a la función de login
  };
  const handleForgotPassword = () => {
    navigate("/recuperar"); // Redirige a la página de recuperación de contraseña
  };
  return (
    <div
      style={{
        background: 'url("https://www.domingoloro.com/images/portfolio_2022/Junio/render-3d-igleisa-01-domingo-loro.jpg") no-repeat center center fixed', // Cambia por la URL de tu imagen de fondo o usa un color
        backgroundSize: "cover",
        height: "100vh", // Altura completa de la ventana
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            backgroundColor: "white", // Fondo blanco para el cajón
            borderRadius: "8px", // Bordes redondeados
            boxShadow: 3, // Sombra para darle profundidad
          }}
        >
          <Typography variant="h4" gutterBottom>
            Iniciar sesión
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Iniciar sesión
            </Button>
          </form>
          <Link
            href="#"
            onClick={handleForgotPassword}
            sx={{ marginTop: 2, textDecoration: "none" }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
