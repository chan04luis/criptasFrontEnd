import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface AlertModalProps {
  open: boolean;
  message: string;
  title: string;
  type: "error" | "warning" | "success"; // Define los tipos
  onClose: () => void;
  configuracion?: {
    colorPrimary?: string;
    colorSecundario?: string;
    contrasteSecundario?: string;
  };
}

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  message,
  title,
  type,
  onClose,
  configuracion = {},
}) => {
  const defaultColors = {
    error: {
      colorPrimary: "#f44336",
      colorSecundario: "#d32f2f",
    },
    warning: {
      colorPrimary: "#ffa726",
      colorSecundario: "#fb8c00",
    },
    success: {
      colorPrimary: "#66bb6a",
      colorSecundario: "#388e3c",
    },
  };

  const colors = {
    colorPrimary: configuracion.colorPrimary || defaultColors[type].colorPrimary,
    colorSecundario: configuracion.colorSecundario || defaultColors[type].colorSecundario,
  };

  const Icon = {
    error: ErrorIcon,
    warning: WarningIcon,
    success: CheckCircleIcon,
  }[type];

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
          p: 4,
          width: 300,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <Icon
            sx={{
              color: colors.colorSecundario,
              marginRight: 1,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: colors.colorSecundario,
            }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </Box>
        <Typography
          sx={{
            color: colors.colorPrimary,
            marginBottom: 3,
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.colorPrimary,
            color: "#fff",
            width: "100%",
          }}
          onClick={onClose}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;
