import React, { useState, useContext, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Collapse,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { ExpandLess, ExpandMore, People, Group, Logout, Menu as MenuIcon } from "@mui/icons-material";
import { Routes, Route, Link } from "react-router-dom";
import CatalogoUsuarios from "./Usuarios/CatalogoUsuarios";
import { AuthContext } from "../contexts/AuthContext";

const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState("");
  const [catalogoOpen, setCatalogoOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(formattedTime);
    };
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleCatalogo = () => {
    setCatalogoOpen(!catalogoOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 240 }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#283593",
          color: "white",
        }}
      >
        <Avatar sx={{ bgcolor: "#ffb74d", mb: 1 }}>
          {user?.name?.[0] || "A"}
        </Avatar>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {user?.name || "Usuario"}
        </Typography>
        <Typography variant="body2">{currentTime}</Typography>
      </Box>
      <Divider sx={{ bgcolor: "white" }} />

      <List>
        <ListItemButton onClick={toggleCatalogo}>
          <ListItemText primary="Catálogos" />
          {catalogoOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={catalogoOpen} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton component={Link} to="/admin/usuarios" sx={{ pl: 4 }}>
      <Group sx={{ marginRight: 1 }} /> {/* Icono de usuarios */}
      <ListItemText primary="Usuarios" />
    </ListItemButton>
    <ListItemButton component={Link} to="/admin/clientes" sx={{ pl: 4 }}>
      <People sx={{ marginRight: 1 }} /> {/* Icono de clientes */}
      <ListItemText primary="Clientes" />
    </ListItemButton>
  </List>
</Collapse>


        <Divider sx={{ my: 1, bgcolor: "white" }} />

        <ListItemButton onClick={logout}>
          <Logout sx={{ marginRight: 1 }} />
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#3f51b5",
        }}
      >
        <Toolbar>
            <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
                Administración
            </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            bgcolor: "#3f51b5",
            color: "white",
            marginTop: "64px",
            transform: !drawerOpen ? "translateX(0)" : "translateX(-240px)",
            transition: "transform 0.3s ease-in-out",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          marginLeft: isMobile ? 0 : (drawerOpen ? 0 : "240px"),
          marginTop: "64px", // Respetar altura del AppBar
          overflow: "auto", // Evitar contenido desbordado
        }}
      >
        <Routes>
          <Route path="usuarios" element={<CatalogoUsuarios />} />
          <Route
            path="clientes"
            element={<div><Typography variant="h5">Catálogo de Clientes</Typography></div>}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default Admin;
