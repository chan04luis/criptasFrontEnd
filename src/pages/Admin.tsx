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
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 
import ViewUsers from "./Admin/Catalogos/Usuarios/ViewUsers";
import { ToastContainer } from 'react-toastify';
import ViewConfigs from "./Admin/Seguridad/Configuraciones/ViewConfigs";
import ElementosSistema from "./Admin/Seguridad/Modulos/ElementosSistema";
import IndexPerfil from "./Admin/Seguridad/Perfil/IndexPerfil";
import PermisosPerfil from "./Admin/Seguridad/Permisos/PermisosPerfil";
import ChangePass from "./Admin/Seguridad/Configuraciones/changePass";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import IndexIglesias from "./Admin/Catalogos/Iglesias/IndexIglesias";
import IndexZonas from "./Admin/Catalogos/Zonas/IndexZonas";
import IndexSecciones from "./Admin/Catalogos/Secciones/IndexSecciones";

const AdminDrawer = ({
  result,
  currentTime,
  logout,
}: any) =>{
  window.document.title = result?.Configuracion.TituloNavegador;
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };
  return (
    <PerfectScrollbar>
      <Box sx={{ width: 240 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: result?.Configuracion.ColorPrimario,
            color: result?.Configuracion.ContrastePrimario,
          }}
        >
          <Avatar sx={{ bgcolor: result?.Configuracion.ColorSecundario, mb: 1 }}>
            {result?.Usuario?.Nombres?.[0] || "A"}
          </Avatar>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {result?.Usuario?.Nombres || "Usuario"} {result?.Usuario?.Apellidos || "Usuario"}
          </Typography>
          <Typography variant="body2">{currentTime}</Typography>
        </Box>
        <Divider sx={{ bgcolor: result?.Configuracion.ContrastePrimario }} />

        <List>

          {result?.Menu && Object.entries(result?.Menu).map(([key, section]: any) => {
            if (key === '_paths') return null; // Excluir "_paths" del menú

            const { nombre, mostrar, _paginas } = section;
            if (!mostrar) return null; // Si no se debe mostrar, omitir

            return (
              <div key={key}>
                <ListItemButton onClick={() => toggleSection(key)}>
                  <ListItemText primary={nombre} />
                  {openSections[key] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSections[key]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {Object.entries(_paginas).map(([pageKey, pagina]: any) => {
                      const { nombre: pageName, path, mostrar: showPage } = pagina;
                      if (!showPage) return null; // Si no se debe mostrar la página, omitir

                      return (
                        <ListItemButton
                          key={pageKey}
                          component={Link}
                          to={'/admin'+path}
                          sx={{ pl: 4 }}
                        >
                          <ListItemText primary={pageName} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </div>
            );
          })}

          <Divider sx={{ my: 1, bgcolor: "white" }} />

          <ListItemButton onClick={logout}>
            <Logout sx={{ marginRight: 1 }} />
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </List>
      </Box>
    </PerfectScrollbar>
  );
}

const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, result } = useAuth(); // Usar el hook de context directamente
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
          backgroundColor: result?.Configuracion.ColorPrimario,
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
            bgcolor:  result?.Configuracion.ColorPrimario,
            color: result?.Configuracion.ContrastePrimario,
            marginTop: isMobile ? "54px" : "64px",
            transform: !drawerOpen ? "translateX(0)" : "translateX(-240px)",
          },
        }}
      >
        <AdminDrawer
          result={result} // Contexto de usuario
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
            backgroundColor: "#f2f2f2",
            p: 0,
            marginLeft: isMobile ? 0 : drawerOpen ? 0 : "240px",
            marginTop: "64px",
            overflow: "auto",
          }}
        >
          <Routes>
            <Route path="seguridad/usuarios" element={<ViewUsers parentConfig={result?.Configuracion} />} />
            <Route
              path="clientes"
              element={
                <div>
                  <Typography variant="h5">Catálogo de Clientes</Typography>
                </div>
              }
            />
            <Route path="seguridad/config-general" element={<ViewConfigs parentConfig={result?.Configuracion} />} />
            
            <Route path="seguridad/elementos-sistema" element={<ElementosSistema parentConfig={result?.Configuracion} />} />
            
            <Route path="seguridad/cambio_contra" element={<ChangePass parentConfig={result?.Configuracion} user={result?.Usuario} />} />

            <Route path="seguridad/perfiles" element={<IndexPerfil parentConfig={result?.Configuracion} />} />
            
            <Route path="perfiles/permisos/:idPerfil" element={<PermisosPerfil />} />

            <Route path="catalogos/iglesias" element={<IndexIglesias parentConfig={result?.Configuracion} />} />

            <Route path="catalogos/zonas/:id" element={<IndexZonas parentConfig={result?.Configuracion} />} />

            <Route path="catalogos/secciones/:id" element={<IndexSecciones parentConfig={result?.Configuracion} />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={5000} />
        </Box>
    </Box>
  );
};

export default Admin;
