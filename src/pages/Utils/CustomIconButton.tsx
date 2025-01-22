import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";

const CustomIconButton: React.FC<IconButtonProps> = (props) => {
  return (
    <IconButton
      {...props}
      sx={{
        backgroundColor: "#fff",
        color: "#FF9800",
        borderRadius: "50%",
        padding: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        "&:hover": { backgroundColor: "#f5f5f5" },
        ...props.sx, // Permite sobrescribir o extender los estilos si es necesario
      }}
    >
      {props.children}
    </IconButton>
  );
};

export default CustomIconButton;
