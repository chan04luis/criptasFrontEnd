import { useState, useEffect } from "react";
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
import {
  ExpandLess,
  ExpandMore,
  People,
  Group,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 
import ViewUsers from "./Admin/Catalogos/Usuarios/ViewUsers";
import CreateUser from "./Admin/Catalogos/Usuarios/CreateUser";
import { ToastContainer } from 'react-toastify';

const AdminDrawer = ({
  user,
  currentTime,
  toggleCatalogo,
  catalogoOpen,
  logout,
}: any) => (
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
        {user?.Nombres?.[0] || "A"}
      </Avatar>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        {user?.Nombres || "Usuario"} {user?.Apellidos || "Usuario"}
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
            <Group sx={{ marginRight: 1 }} />
            <ListItemText primary="Usuarios" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/clientes" sx={{ pl: 4 }}>
            <People sx={{ marginRight: 1 }} />
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

const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, user } = useAuth(); // Usar el hook de context directamente
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
            marginTop: isMobile ? "54px" : "64px",
            transform: !drawerOpen ? "translateX(0)" : "translateX(-240px)",
          },
        }}
      >
        <AdminDrawer
          user={user} // Contexto de usuario
          currentTime={currentTime}
          toggleCatalogo={toggleCatalogo}
          catalogoOpen={catalogoOpen}
          logout={logout}
        />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          marginLeft: isMobile ? 0 : drawerOpen ? 0 : "240px",
          marginTop: "64px",
          overflow: "auto",
        }}
      >
        <Routes>
          <Route path="usuarios" element={<ViewUsers />} />
          <Route path="usuarios/crear" element={<CreateUser />} />
          <Route path="usuarios/editar/:id?" element={<CreateUser />} />
          <Route
            path="clientes"
            element={
              <div>
                <Typography variant="h5">Catálogo de Clientes</Typography>
              </div>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={5000} />
      </Box>
    </Box>
  );
};

export default Admin;
