import React from "react";
import {
  Box,
  TextField,
  Button,
  Drawer,
  Typography,
  Autocomplete,
} from "@mui/material";

export interface FilterField<T> {
  type: "text" | "date" | "autocomplete";
  name: keyof T;
  label: string;
  value: any; // Valor actual del campo
  options?: { id: any; label: string }[]; // Opciones para autocompletar
  maxLength?: number; // Longitud máxima para texto
}

interface GenericFilterFormProps<T> {
  filters: T;
  setFilters: React.Dispatch<React.SetStateAction<T>>;
  onSearch: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  fields: FilterField<T>[];
}

const GenericFilterForm = <T,>({
  filters,
  setFilters,
  onSearch,
  isDrawerOpen,
  toggleDrawer,
  fields,
}: GenericFilterFormProps<T>) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value as T[keyof T],
    }));
  };

  const clearFilters = () => {
    const clearedFilters = fields.reduce((acc, field) => {
      acc[field.name] = field.type === "autocomplete" ? ("" as T[keyof T]) : (null as T[keyof T]);
      return acc;
    }, {} as T);
    setFilters(clearedFilters);
  };

  return (
    <Box>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer} sx={{
      zIndex: (theme) => theme.zIndex.drawer + 2, 
    }}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          {fields.map((field) => {
            if (field.type === "text") {
              return (
                <TextField
                  key={String(field.name)}
                  label={field.label}
                  name={String(field.name)}
                  value={(filters[field.name] as string) || ""}
                  onChange={(e) => {
                    if (!field.maxLength || e.target.value.length <= field.maxLength) {
                      handleChange(e);
                    }
                  }}
                  fullWidth
                  sx={{ marginY:2 }}
                />
              );
            }
            if (field.type === "date") {
              const dateValue = filters[field.name];
              return (
                <TextField
                  key={String(field.name)}
                  label={field.label}
                  type="date"
                  name={String(field.name)}
                  value={
                    typeof dateValue === "string" ? dateValue.slice(0, 10) : ""
                  }
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginY:2 }}
                  slotProps={{
                    inputLabel: { shrink: true }, 
                  }}
                />
              );
            }
            if (field.type === "autocomplete") {
              return (
                <Autocomplete
                  key={String(field.name)}
                  options={field.options || []}
                  getOptionLabel={(option) => option.label}
                  value={
                    field.options?.find((opt) => opt.id === filters[field.name]) || null
                  }
                  onChange={(_, newValue) => {
                    setFilters((prev) => ({
                      ...prev,
                      [field.name]: newValue?.id as T[keyof T],
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={field.label} />
                  )}
                  fullWidth
                  sx={{ marginY:2 }}
                />
              );
            }
            return null;
          })}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                toggleDrawer();
                onSearch();
              }}
              sx={{ marginRight: 1, fontSize: "12px" }}
            >
              Aplicar filtros
            </Button>
            <Button variant="outlined" color="primary" fullWidth onClick={clearFilters} sx={{ marginRight: 1, fontSize: "12px" }}>
              Limpiar
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default GenericFilterForm;
