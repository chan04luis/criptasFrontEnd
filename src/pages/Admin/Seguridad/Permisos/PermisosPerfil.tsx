import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Typography,
  CircularProgress,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DescriptionIcon from "@mui/icons-material/Description";
import WebIcon from "@mui/icons-material/Web";
import CircleIcon from "@mui/icons-material/Circle";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PermisosService from "../../../../services/Seguridad/PermisosService";
import { PerfilPermisos } from "../../../../entities/Seguridad/Permisos/PerfilPermisos";
import { PermisoModulo } from "../../../../entities/Seguridad/Permisos/PermisoModulo";
import { PermisoPagina } from "../../../../entities/Seguridad/Permisos/PermisoPagina";
import { PermisoBoton } from "../../../../entities/Seguridad/Permisos/PermisoBoton";
import MasterLayout from "../../Seguridad/Modulos/MasterLayout";
import CustomIconButton from "../../../Utils/CustomIconButton";
import { RootObject } from "../../../../entities/Seguridad/RootObject";

interface PermisosPerfilProps {
  result: RootObject | null;
}


const PermisosPerfil: React.FC<PermisosPerfilProps> = ({ result }) => {
  var config = result?.Configuracion;
  const { idPerfil } = useParams<{ idPerfil: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PerfilPermisos | null>(null);
  const [expandedModules, setExpandedModules] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedPages, setExpandedPages] = useState<{
    [key: string]: boolean;
  }>({});
  const fetchPermisos = async () => {
    setLoading(true);
    try {
      const response = await PermisosService.get(idPerfil || "");
      if (!response.HasError) {
        setData(response.Result);
        const initialModules: { [key: string]: boolean } = {};
        response.Result.Permisos.forEach((modulo) => {
          initialModules[modulo.IdModulo] = false;
          modulo.PermisosPagina.forEach((pagina) => {
            initialModules[pagina.IdPagina] = false;
          });
        });
        setExpandedModules(initialModules);
      } else {
        console.error(response.Message);
      }
    } catch (error) {
      console.error("Error al cargar permisos:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!loading)
      fetchPermisos();
  }, []);

  const handleSave = async () => {
    if (data) {
      setLoading(true);
      try {
        data.IdPerfil = data.Perfil.IdPerfil;
        const response = await PermisosService.post(data);
        if (!response.HasError) {
          alert("Permisos guardados con éxito");
        } else {
          console.error(response.Message);
        }
      } catch (error) {
        console.error("Error al guardar permisos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleExpandModule = (idModulo: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [idModulo]: !prev[idModulo],
    }));
  };

  const toggleExpandPage = (idPagina: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [idPagina]: !prev[idPagina],
    }));
  };

  const handleToggleModulo = (modulo: PermisoModulo) => {
    modulo.TienePermiso = !modulo.TienePermiso;
    modulo.PermisosPagina.forEach((pagina) => {
      pagina.TienePermiso = modulo.TienePermiso;
      pagina.PermisosBoton.forEach((boton) => {
        boton.TienePermiso = modulo.TienePermiso;
      });
    });
    setData({ ...data! });
  };

  const handleTogglePagina = (modulo: PermisoModulo, pagina: PermisoPagina) => {
    pagina.TienePermiso = !pagina.TienePermiso;
    pagina.PermisosBoton.forEach((boton) => {
      boton.TienePermiso = pagina.TienePermiso;
    });
    modulo.TienePermiso = modulo.PermisosPagina.filter(x => x.TienePermiso).length > 0;
    setData({ ...data! });
  };

  const handleToggleBoton = (modulo: PermisoModulo, pagina: PermisoPagina, boton: PermisoBoton) => {
    boton.TienePermiso = !boton.TienePermiso;
    pagina.TienePermiso = pagina.PermisosBoton.filter(x => x.TienePermiso).length > 0;
    modulo.TienePermiso = modulo.PermisosPagina.filter(p => p.PermisosBoton.filter(x => x.TienePermiso).length > 0).length > 0;
    setData({ ...data! });
  };

  const renderPermisos = () =>
    data?.Permisos.map((modulo) => (
      <Box key={modulo.IdModulo} sx={{ marginBottom: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => toggleExpandModule(modulo.IdModulo)}>
            {expandedModules[modulo.IdModulo] ? (
              <ExpandMoreIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <Checkbox
            checked={modulo.TienePermiso}
            onChange={() => handleToggleModulo(modulo)}
          />
          <DescriptionIcon sx={{ color: "#4caf50" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {modulo.NombreModulo} ({modulo.ClaveModulo})
          </Typography>
        </Stack>
        <Divider sx={{ marginY: 1 }} />

        {expandedModules[modulo.IdModulo] &&
          modulo.PermisosPagina.map((pagina) => (
            <Box key={pagina.IdPagina} sx={{ paddingLeft: 4, marginBottom: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={() => toggleExpandPage(pagina.IdPagina)}>
                  {expandedPages[pagina.IdPagina] ? (
                    <ExpandMoreIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
                <Checkbox
                  checked={pagina.TienePermiso}
                  onChange={() => handleTogglePagina(modulo, pagina)}
                />
                <WebIcon sx={{ color: "#2196f3" }} />
                <Typography>
                  {pagina.NombrePagina} ({pagina.ClavePagina})
                </Typography>
              </Stack>
              {expandedPages[pagina.IdPagina] &&
                pagina.PermisosBoton.map((boton) => (
                  <Box key={boton.IdBoton} sx={{ paddingLeft: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Checkbox
                        checked={boton.TienePermiso}
                        onChange={() => handleToggleBoton(modulo, pagina, boton)}
                      />
                      <CircleIcon sx={{ color: "#f44336" }} />
                      <Typography>
                        {boton.NombreBoton} ({boton.ClaveBoton})
                      </Typography>
                    </Stack>
                  </Box>
                ))}
            </Box>
          ))}
      </Box>
    ));

  const renderActions = (
    <>
      <CustomIconButton onClick={fetchPermisos} title="Refrescar datos">
        <RefreshIcon />
      </CustomIconButton>
      {result?.PermisosBotones.find(x => x.ClaveBoton == 'edit_perfil')?.TienePermiso && <CustomIconButton onClick={handleSave} title="Guardar cambios">
        <SaveIcon />
      </CustomIconButton>}
      <CustomIconButton onClick={() => navigate(-1)} title="Volver">
        <ArrowBackIcon />
      </CustomIconButton>
    </>
  );

  return (
    <MasterLayout titlePage="Permisos del Perfil" config={config} buttonActions={renderActions}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>{renderPermisos()}</Box>
      )}
    </MasterLayout>
  );
};

export default PermisosPerfil;
