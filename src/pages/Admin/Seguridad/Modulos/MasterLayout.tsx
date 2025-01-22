import React, { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

interface MasterLayoutProps {
  titlePage: string;
  buttonActions?: ReactNode; // Botones o acciones para la cabecera
  children: ReactNode; // Contenido principal
}

const MasterLayout: React.FC<MasterLayoutProps> = ({
  titlePage,
  buttonActions,
  children,
}) => {
  return (
    <Box>
      {/* Encabezado con título y acciones */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {titlePage}
          </Typography>
          {buttonActions && <Box sx={{ display: "flex", gap: 1 }}>{buttonActions}</Box>}
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Box p={2}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 1,
            padding: 2,
            minHeight: "70vh",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MasterLayout;
