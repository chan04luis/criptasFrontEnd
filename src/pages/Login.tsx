import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Link } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from '../hooks/useAuth';
import { apiUrl, errorServer } from "../config/globals";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { updateToken } = useAuth(); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica para asegurar que los campos no estén vacíos
    if (!email || !password) {
      toast.error("Por favor ingresa tu correo y contraseña.");
      return;
    }

    const userCredentials = { Correo: email, Contra: password };

    try {
      const response = await axios.patch(`${apiUrl}/Login`, userCredentials, {
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json-patch+json',
        }
      });

      if (response.data.HasError) {
        toast.error('Error: ' + response.data.Message);
      } else {
        const token = response.data.Result.Token;
        if (token) {
            toast.success('Login Exitoso');
            updateToken(token, response.data.Result.Id);
        } else {
          toast.error('No se recibió un token');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error('Error: ' + (error.response.data.Message || 'Hubo un error al intentar iniciar sesión'));
        } else {
          toast.error('Hubo un error al intentar iniciar sesión');
        }
      } else {
        toast.error(errorServer);
      }
    }
  };

  const handleForgotPassword = () => {
    toast.info('Recuperación de contraseña no implementada');
  };

  return (
    <div
      style={{
        background: 'url(/wallpaper_iglesia.jpg) no-repeat center center fixed',
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center", 
        alignItems: "center", 
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
            width: "100%",
            maxWidth: "400px",
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
              autoComplete="email"
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
              autoComplete="current-password"
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

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Login;
