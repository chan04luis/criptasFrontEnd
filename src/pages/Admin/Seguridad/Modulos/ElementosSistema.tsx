import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Stack,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Radio,
} from "@mui/material";
import "react-treeview/react-treeview.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WebIcon from "@mui/icons-material/Web";
import DescriptionIcon from "@mui/icons-material/Description";
import CircleIcon from "@mui/icons-material/Circle";
import ConfiguracionService from "../../../../services/Seguridad/ConfiguracionService";
import MasterLayout from "./MasterLayout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import CustomIconButton from '../../../Utils/CustomIconButton'
import BotonService from "../../../../services/Seguridad/BotonService";
import { toast } from "react-toastify";
import { Boton } from "../../../../entities/Seguridad/Elementos/Boton";
import { Pagina } from "../../../../entities/Seguridad/Elementos/Pagina";
import { Modulo } from "../../../../entities/Seguridad/Elementos/Modulo";
import GenericFormModal from "../../../Utils/GenericFormModal";
import BotonForm from "../Botones/BotonForm";
import PaginaForm from "../Paginas/PaginaForm";
import ModuloForm from "./ModuloForm";
import PaginaService from "../../../../services/Seguridad/PaginaService";
import ModuloService from "../../../../services/Seguridad/ModuloService";
import ConfirmModal from "../../../Utils/ConfirmModal";
import InfoIcon from '@mui/icons-material/Info';

interface ElementosSistemaProps {
  parentConfig: Configuracion | undefined; // Recibe la configuración como prop
}

const ElementosSistema: React.FC<ElementosSistemaProps> = ({
  parentConfig,
}) => {
  const [elements, setElements] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const [expandedPages, setExpandedPages] = useState<{ [key: string]: boolean }>({});
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [handleDelete, setHandleDelete] = useState<(() => Promise<void>) | null>(null);

  const [entity, setEntity] = useState<"Boton" | "Pagina" | "Modulo">("Boton");
  const [formData, setFormData] = useState<Boton | Pagina | Modulo>({
    IdBoton: "",
    IdPagina: "",
    ClaveBoton: "",
    NombreBoton: "",
  });
  
  const handleOpenModal = (entityType: "Boton" | "Pagina" | "Modulo") => {
    setEntity(entityType);
    setFormData(
      entityType === "Boton"
        ? { IdBoton: "", IdPagina: selectedModule.IdPagina, ClaveBoton: "", NombreBoton: "" }
        : entityType === "Pagina"
        ? {
            IdPagina: "",
            IdModulo: selectedModule.IdModulo,
            ClavePagina: "",
            NombrePagina: "",
            PathPagina: "",
            MostrarEnMenu: false,
            Botones: []
          }
        : { IdModulo: "", ClaveModulo: "", NombreModulo: "", PathModulo: "", MostrarEnMenu: false, Paginas: [] }
    );
    setModalOpen(true);
  };

  const handleOpenModalEdith = (entityType: "Boton" | "Pagina" | "Modulo") => {
    setEntity(entityType);
    setFormData(
      entityType === "Boton"
        ? selectedModule as Boton
        : entityType === "Pagina"
        ?  selectedModule as Pagina
        : selectedModule as Modulo
    );
    setModalOpen(true);
  };

  const handleSaveModal = async() =>{
    var consulta = null;
    switch(entity){
      case "Modulo":
        consulta = (formData as Modulo).IdModulo != "" ? await ModuloService.put(formData as Modulo) : await ModuloService.post(formData as Modulo);
        break;
      case "Pagina":
        consulta = (formData as Pagina).IdPagina != "" ? await PaginaService.put(formData as Pagina) : await PaginaService.post(formData as Pagina);
        break;
      case "Boton":
        consulta = (formData as Boton).IdBoton != "" ? await BotonService.put(formData as Boton) : await BotonService.post(formData as Boton);
        break;
    }
    if(!consulta?.HasError){
      fetchElements();
    }else if(consulta?.HasError){
      toast.warn(consulta.Message);
    }else{
      toast.error("Error en el servicio");
    }
    setModalOpen(false);
  }

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Reutilizable para detalles
  const renderDetails = (i: any) => (
    <Box
      sx={{
        top: 64, // Altura del AppBar
        right: 0,
        width: "300px",
        height: "100%",
        background: "white",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
    >
      {/* Encabezado del panel */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 0,
          borderBottom: `1px solid ${parentConfig?.ColorPrimario}`,
          py: 0.5,
          px: 2,
          backgroundColor: parentConfig?.ColorPrimario,
          color: parentConfig?.ContrastePrimario
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: parentConfig?.ContrastePrimario }}
        >
          Detalles
        </Typography>
        <CustomIconButton
          title="Cerrar"
          onClick={() => setShowDetails(false)}
        >
          <ChevronRightIcon />
        </CustomIconButton>
      </Box>
  
      {/* Contenido de los detalles */}
      <Typography variant="body2" m={2}>
          <strong>Id:</strong> {i.IdBoton || i.IdPagina || i.IdModulo}
      </Typography>

      <Typography variant="body2" m={2}>
        <strong>Nombre:</strong> {i.NombrePagina || i.IdPagina || i.NombreModulo}
      </Typography>
      
      <Typography variant="body2" m={2}>
        <strong>{i.ClaveBoton ? 'Clave de botom': 'Ruta'}:</strong> {i.PathModulo || i.PathPagina || i.ClaveBoton}
      </Typography>
      {i?.MostrarEnMenu !== undefined && (
        <Box display="flex" alignItems="center" m={2}>
          <Typography variant="body2" component="span" sx={{ marginRight: 1 }}>
            <strong>Mostrar en Menú:</strong>
          </Typography>
          <Checkbox readOnly checked={i.MostrarEnMenu} />
        </Box>
      )}

      
    </Box>
  );
  

  const handleToggleDetails = () => {
    if(selectedModule)
      setShowDetails((prev) => !prev);
  };

  const fetchElements = async () => {
    setLoading(true);
    try {
      const response = await ConfiguracionService.getConfiguracionElementos();
      if (!response.HasError) {
        const result = Array.isArray(response.Result) ? response.Result : [response.Result];
        setElements(result);
  
        // Inicializa el estado de expansión
        const initialExpandedModules = result.reduce((acc: { [key: string]: boolean }, modulo: Modulo) => {
          acc[modulo.IdModulo] = false;
          return acc;
        }, {});
        setExpandedModules(initialExpandedModules);
  
        const initialExpandedPages = result.reduce((acc: { [key: string]: boolean }, modulo: Modulo) => {
          modulo.Paginas.forEach((pagina) => {
            acc[pagina.IdPagina] = false;
          });
          return acc;
        }, {});
        setExpandedPages(initialExpandedPages);
  
      } else {
        console.error(response.Message);
      }
    } catch (error) {
      console.error("Error al obtener los elementos del sistema", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchElements();
  }, []);

  const handleConfirmDelete = async () => {
    if (handleDelete) {
      await handleDelete(); 
      setOpenConfirmModal(false);
    }
  };

  const deleteBoton = async(item : any) =>{
    setEntity("Boton");
    setHandleDelete(() => async() =>{
      const eliminado = await BotonService.delete(item.IdBoton);
      if(eliminado.HasError || !eliminado.Result ){
        toast.error(eliminado.Message);
      }else{
        fetchElements();
        setSelectedModule(null);
        toast.success(eliminado.Message);
      }
    });
    setOpenConfirmModal(true);
  }

  const deletePagina = async(item : any) =>{
    setEntity("Pagina");
    setHandleDelete(() => async() =>{
      const eliminado = await PaginaService.delete(item.IdPagina);
      if(eliminado.HasError || !eliminado.Result ){
        toast.error(eliminado.Message);
      }else{
        fetchElements();
        setSelectedModule(null);
        toast.success(eliminado.Message);
      }
    });
    setOpenConfirmModal(true);
  }

  const deleteModulo = async(item : any) =>{
    setEntity("Modulo");
    setHandleDelete(() => async() =>{
      const eliminado = await ModuloService.delete(item.IdModulo);
      if(eliminado.HasError || !eliminado.Result ){
        toast.error(eliminado.Message);
      }else{
        fetchElements();
        setSelectedModule(null);
        toast.success(eliminado.Message);
      }
    });
    setOpenConfirmModal(true);
  }

  const renderActions = (
    <>
      <CustomIconButton title="Refrescar datos" onClick={fetchElements}>
        <RefreshIcon />
      </CustomIconButton>
      <CustomIconButton title="Opciones" onClick={handleMenuClick}>
        <MoreVertIcon />
      </CustomIconButton>
      
      <CustomIconButton title="Información" onClick={handleToggleDetails} disabled={!selectedModule}>
        <InfoIcon />
      </CustomIconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOpenModal("Modulo") }>Crear módulo</MenuItem>
        <MenuItem disabled={selectedModule?.IdModulo == undefined || selectedModule?.IdPagina != undefined} onClick={() => handleOpenModalEdith("Modulo")}>Editar módulo</MenuItem>
        <MenuItem disabled={selectedModule?.IdModulo == undefined || selectedModule?.IdPagina != undefined} onClick={() => deleteModulo(selectedModule) }>Eliminar módulo</MenuItem>
        <Divider />
        <MenuItem disabled={selectedModule?.IdModulo == undefined} onClick={() => handleOpenModal("Pagina") }>Crear página</MenuItem>
        <MenuItem disabled={selectedModule?.IdPagina == undefined || selectedModule?.IdBoton != undefined} onClick={() => handleOpenModalEdith("Pagina") }>Editar página</MenuItem>
        <MenuItem disabled={selectedModule?.IdPagina == undefined || selectedModule?.IdBoton != undefined} onClick={() => deletePagina(selectedModule) }>Eliminar página</MenuItem>
        <Divider />
        <MenuItem disabled={selectedModule?.IdPagina == undefined} onClick={() => handleOpenModal("Boton")}>Crear Botón</MenuItem>
        <MenuItem disabled={selectedModule?.IdBoton == undefined} onClick={() => handleOpenModalEdith("Boton") }>Editar Botón</MenuItem>
        <MenuItem disabled={selectedModule?.IdBoton == undefined} onClick={() => deleteBoton(selectedModule)}>Eliminar Botón</MenuItem>
      </Menu>
    </>
  );

  const renderForm = () => {
    var render = <></>;
    switch(entity){
      case "Boton": return (<BotonForm data={formData as Boton} onChange={setFormData} ></BotonForm>);
      case "Pagina": return (<PaginaForm data={formData as Pagina} onChange={setFormData} ></PaginaForm>);
      case "Modulo": return (<ModuloForm formData={formData as Modulo} onChange={setFormData} ></ModuloForm>);
    }
    return render;
  }

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
  

  return (
    <Box display="flex" sx={{height: "100%", width: "100%"}}>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <MasterLayout titlePage="Elementos del sistema" config={parentConfig} buttonActions={renderActions}>
          <Box p={2}>

            {loading && (
              <Typography sx={{ color: parentConfig?.ContrasteSecundario }}>
                Cargando elementos...
              </Typography>
            )}
            
            {!loading && (
              <Box>
                {elements.map((modulo, i) => (
                  <Box key={i} sx={{ marginBottom: 2 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedModule(modulo);
                      }}
                    >
                      <IconButton onClick={() => toggleExpandModule(modulo.IdModulo)}>
                        {expandedModules[modulo.IdModulo] ? (
                          <ExpandMoreIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </IconButton>
                      <Radio
                        checked={selectedModule?.IdBoton == undefined && selectedModule?.IdPagina == undefined && selectedModule?.IdModulo === modulo.IdModulo}
                        onChange={() => setSelectedModule(modulo)}
                      />
                      <DescriptionIcon sx={{ color: "#4caf50" }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {modulo.NombreModulo} ({modulo.PathModulo.replace("/", "")})
                      </Typography>
                      <Chip
                          label={modulo.PathModulo}
                          sx={{
                            backgroundColor: "white",
                            color: parentConfig?.ColorPrimario,
                            border: `1px solid ${parentConfig?.ColorPrimario}}`,
                          }}
                          size="small"
                        />
                    </Stack>
                    <Divider sx={{ marginY: 1 }} />

                    {expandedModules[modulo.IdModulo] &&
                      modulo.Paginas.map((pagina, j) => (
                        <Box key={j} sx={{ paddingLeft: 4, marginBottom: 1 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedModule(pagina);
                            }}
                          >
                            <IconButton onClick={() => toggleExpandPage(pagina.IdPagina)}>
                              {expandedPages[pagina.IdPagina] ? (
                                <ExpandMoreIcon />
                              ) : (
                                <ChevronRightIcon />
                              )}
                            </IconButton>
                            <Radio
                              checked={selectedModule?.IdBoton == undefined && selectedModule?.IdPagina === pagina.IdPagina}
                              onChange={() => setSelectedModule(pagina)}
                            />
                            <WebIcon sx={{ color: "#2196f3" }} />
                            <Typography>
                              {pagina.NombrePagina} ({pagina.PathPagina.replace("/", "")})
                            </Typography>
                            <Chip
                              label={pagina.PathPagina}
                              sx={{
                                backgroundColor: "white",
                                color: parentConfig?.ColorSecundario,
                                border: `1px solid ${parentConfig?.ColorSecundario}`,
                              }}
                              size="small"
                            />
                          </Stack>

                          {expandedPages[pagina.IdPagina] &&
                            pagina.Botones.map((boton, k) => (
                              <Box key={k} sx={{ paddingLeft: 6 }}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setSelectedModule(boton);
                                  }}
                                >
                                  <Radio
                                    checked={selectedModule?.IdBoton === boton.IdBoton}
                                    onChange={() => setSelectedModule(boton)}
                                  />
                                  <CircleIcon
                                    sx={{
                                      color: parentConfig?.ColorSecundario,
                                      marginRight: "8px",
                                    }}
                                  />
                                  <Typography >
                                    {boton.NombreBoton}
                                  </Typography>
                                  <Chip
                                    label={boton.ClaveBoton}
                                    sx={{
                                      backgroundColor: "white",
                                      color: parentConfig?.ColorPrimario,
                                      border: `1px solid ${parentConfig?.ColorPrimario}}`,
                                    }}
                                    size="small"
                                  />
                                </Stack>
                              </Box>
                            ))}
                        </Box>
                      ))}
                  </Box>
                ))}
              </Box>
            )}

          </Box>
        </MasterLayout>
      </Box>
      <GenericFormModal
        isLoading={loading}
        open={isModalOpen}
        title={ (selectedModule ? "Editar " : "Crear ") + entity}
        onClose={()=>setModalOpen(false)}
        onSubmit={handleSaveModal}
      >
        {renderForm()}
      </GenericFormModal>

      <ConfirmModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar ${entity=="Pagina"?"la":"el"} ${entity}?`}
      />
      {/* Panel de detalles */}
      {showDetails && selectedModule && renderDetails(selectedModule)}
    </Box>
  );
};

export default ElementosSistema;
