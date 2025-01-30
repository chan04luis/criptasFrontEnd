import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CriptasService from "../../../../services/Catalogos/CriptasService";
import { Criptas } from "../../../../entities/catalogos/criptas/Criptas";
import GenericFormModal from "../../../Utils/GenericFormModal";
import CriptaForm from "./CriptaForm";
import { toast } from "react-toastify";

interface CriptasModalProps {
  idSeccion: string;
  parentConfig: any;
}

const CriptasModal: React.FC<CriptasModalProps> = ({ idSeccion, parentConfig }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [criptas, setCriptas] = useState<Criptas[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedCripta, setSelectedCripta] = useState<Criptas | null>(null);

  const fetchCriptas = async () => {
    setLoading(true);
    try {
      const response = await CriptasService.getCriptasBySeccion(idSeccion);
      if (!response.HasError) {
        setCriptas(response.Result || []);
      } else {
        toast.warn(response.Message);
      }
    } catch (error) {
      toast.error("Error al cargar las criptas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriptas();
  }, []);

  const handleOpenModal = (cripta: Criptas | null = null) => {
    setSelectedCripta(
      cripta || {
        Id: "",
        IdSeccion: idSeccion,
        IdCliente: '2c8e4ed9-d81c-4d0c-a30f-1a8e96e73fc6',
        Numero: "",
        UbicacionEspecifica: "",
        Estatus: true,
        FechaRegistro: "",
        FechaActualizacion: "",
      }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCripta(null);
  };

  const handleSaveCripta = async () => {
    if (selectedCripta) {
      const result = await CriptasService.createOrUpdateCripta(selectedCripta);
      if (result.HasError) {
        toast.error(result.Message || "Error al guardar la cripta.");
      } else {
        toast.success("Cripta guardada con éxito.");
        fetchCriptas();
      }
    }
    handleCloseModal();
  };

  const gridColumns = 3; // Matriz de 3 columnas
  const numRows = Math.ceil((criptas.length + 1) / gridColumns);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        minHeight: "50vh",
        borderRadius: 2,
        textAlign: "center",
      }}
    >

      <Grid container spacing={2} justifyContent="center">
        {criptas.map((cripta, index) => (
          <Grid item key={cripta.Id} xs={4} sm={3} md={3}>
            <Tooltip title={cripta.UbicacionEspecifica}>
              <Box
                sx={{
                  width: "100%",
                  height: "80px",
                  backgroundColor: cripta.Estatus ? "green" : "red",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  cursor: "pointer",
                }}
                onClick={() => handleOpenModal(cripta)}
              >
                <Typography variant="subtitle1">{cripta.Numero}</Typography>
              </Box>
            </Tooltip>
          </Grid>
        ))}

        {/* Botón para agregar nueva cripta */}
        <Grid item xs={4} sm={3} md={3}>
          <Box
            sx={{
              width: "100%",
              height: "80px",
              backgroundColor: "#f5f5f5",
              color: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              cursor: "pointer",
              border: "1px dashed #000",
            }}
            onClick={() => handleOpenModal(null)}
          >
            <AddIcon fontSize="large" />
          </Box>
        </Grid>
      </Grid>

      <GenericFormModal
        open={openModal}
        title={selectedCripta?.Id ? "Editar Cripta" : "Agregar Cripta"}
        onClose={handleCloseModal}
        onSubmit={handleSaveCripta}
        isLoading={loading}
      >
        <CriptaForm setCripta={setSelectedCripta} cripta={selectedCripta!} onSave={handleSaveCripta} />
      </GenericFormModal>
    </Box>
  );
};

export default CriptasModal;
