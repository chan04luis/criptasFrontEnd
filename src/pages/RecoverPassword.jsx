import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RecoverPassword = () => {
  const navigate = useNavigate(); // Hook para la redirección

  const handleBackToLogin = () => {
    navigate("/login"); // Redirige al login
  };

  return (
    <div
      style={{
        background: 'url("https://www.domingoloro.com/images/portfolio_2022/Junio/render-3d-igleisa-01-domingo-loro.jpg") no-repeat center center fixed',
        backgroundSize: "cover",
        height: "100vh",
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
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Mantenimiento
          </Typography>
          <Typography variant="body1" paragraph>
            Lo sentimos, la función de recuperación de contraseña está en mantenimiento.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToLogin}
            sx={{ marginTop: 2 }}
          >
            Regresar al inicio de sesión
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default RecoverPassword;
