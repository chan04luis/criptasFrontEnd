import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface GenericFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

const GenericFormModal: React.FC<GenericFormModalProps> = ({
  open,
  title,
  onClose,
  onSubmit,
  isLoading,
  children,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxWidth: "90%",
          bgcolor: "background.paper",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2, textAlign: "center" }}>
          {title}
        </Typography>

        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            paddingRight: 1,
          }}
        >
          {children}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 2,
          }}
        >
          <Button onClick={onClose} color="error" sx={{ marginRight: 1 }}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={isLoading} variant="contained" color="primary">
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GenericFormModal;
