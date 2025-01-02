import React from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  CircularProgress,
  Toolbar,
} from "@mui/material";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | React.ReactNode;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  configuracion?: {
    colorPrimary?: string;
    colorSecundario?: string;
    contrastePrimary?: string;
    contrasteSecondario?: string;
  };
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmación",
  message,
  isLoading = false,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  configuracion = {},
}) => {
  const {
    colorPrimary = "#283593",
    colorSecundario = "#283593",
    contrastePrimary = "#fff",
    contrasteSecondario = "#fff",
  } = configuracion;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          width: 400,
          maxWidth: "85%",
          borderRadius: 2,
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: colorSecundario,
            color: contrasteSecondario,
            py: 0,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: contrasteSecondario,
            }}
          >
            {title}
          </Typography>
        </Toolbar>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ marginBottom: 2 }}>{message}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {isLoading ? (
              <CircularProgress sx={{ color: colorPrimary }} />
            ) : (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: colorPrimary, color: contrastePrimary }}
                  onClick={onConfirm}
                >
                  {confirmButtonText}
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  {cancelButtonText}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
