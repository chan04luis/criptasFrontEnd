import React, { useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import { SucursalUpdateMaps } from "../../../../entities/Catalogos/sucursales/SucursalUpdateMaps";

interface UpdateSucursalMapsProps {
  sucursal: SucursalUpdateMaps;
  setSucursal: (sucursal: SucursalUpdateMaps) => void;
  onSave: () => void;
}

const UpdateSucursalMaps: React.FC<UpdateSucursalMapsProps> = ({ sucursal, setSucursal }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialPosition = {
      lat: parseFloat(sucursal.Latitud) || 20.9671,
      lng: parseFloat(sucursal.Longitud) || -89.5926,
    };

    const googleMap = new google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 15,
    });

    const mapMarker = new google.maps.Marker({
      position: initialPosition,
      map: googleMap,
      draggable: true,
    });

    // Evento cuando se arrastra el marcador
    mapMarker.addListener("dragend", () => {
      const newPosition = mapMarker.getPosition();
      if (newPosition) {
        setSucursal({
          ...sucursal,
          Latitud: newPosition.lat().toString(),
          Longitud: newPosition.lng().toString(),
        });
      }
    });

    setMap(googleMap);
    setMarker(mapMarker);
  }, []);

  useEffect(() => {
    if (map && marker) {
      const newPosition = {
        lat: parseFloat(sucursal.Latitud) || 0,
        lng: parseFloat(sucursal.Longitud) || 0,
      };
      marker.setPosition(newPosition);
      map.setCenter(newPosition);
    }
  }, [sucursal.Latitud, sucursal.Longitud]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSucursal({ ...sucursal, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ padding: 0 }}>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Latitud"
          name="Latitud"
          value={sucursal.Latitud}
          onChange={handleChange}
          fullWidth
          required
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Longitud"
          name="Longitud"
          value={sucursal.Longitud}
          onChange={handleChange}
          fullWidth
          required
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Box>
      <Box ref={mapRef} sx={{ width: "100%", height: "300px", borderRadius: 2, border: "1px solid #ddd" }} />
    </Box>
  );
};

export default UpdateSucursalMaps;
