import React, { useContext } from "react";
import { Button, Box, Typography } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const Visits = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Hola Mundo
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Visits;
