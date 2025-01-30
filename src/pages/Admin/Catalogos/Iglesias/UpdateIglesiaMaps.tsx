import React, { useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import { IglesiaUpdateMaps } from "../../../../entities/catalogos/iglesias/IglesiaUpdateMaps";

interface UpdateIglesiaMapsProps {
  iglesia: IglesiaUpdateMaps;
  setIglesia: (iglesia: IglesiaUpdateMaps) => void;
  onSave: () => void;
}

const UpdateIglesiaMaps: React.FC<UpdateIglesiaMapsProps> = ({ iglesia, setIglesia, onSave }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialPosition = {
      lat: parseFloat(iglesia.Latitud) || 20.9671,
      lng: parseFloat(iglesia.Longitud) || -89.5926,
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
        setIglesia({
          ...iglesia,
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
        lat: parseFloat(iglesia.Latitud) || 0,
        lng: parseFloat(iglesia.Longitud) || 0,
      };
      marker.setPosition(newPosition);
      map.setCenter(newPosition);
    }
  }, [iglesia.Latitud, iglesia.Longitud]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIglesia({ ...iglesia, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Latitud"
        name="Latitud"
        value={iglesia.Latitud}
        onChange={handleChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Longitud"
        name="Longitud"
        value={iglesia.Longitud}
        onChange={handleChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />
      <Box ref={mapRef} sx={{ width: "100%", height: "400px", borderRadius: 2, border: "1px solid #ddd" }} />
    </Box>
  );
};

export default UpdateIglesiaMaps;
