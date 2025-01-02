import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";

interface GenericFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

const GenericFormModal: React.FC<GenericFormModalProps> = ({
  open,
  title,
  onClose,
  onSubmit,
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
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {title}
        </Typography>
        {children}
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
          <Button onClick={onSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GenericFormModal;
