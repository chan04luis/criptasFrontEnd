import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Login from "../pages/Login";
import RecoverPassword from "../pages/RecoverPassword";
import Admin from "../pages/Admin";
import Visits from "../pages/Visits";

const AppRouter = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate replace to="/admin" />}
        />
        <Route
          path="/recuperar"
          element={!user ? <RecoverPassword /> : <Navigate replace to="/admin" />}
        />

        {/* Rutas privadas */}
        <Route
          path="/admin/*" // Rutas internas de admin ahora tienen el * al final
          element={user ? <Admin /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/visitas"
          element={user ? <Visits /> : <Navigate replace to="/login" />}
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate replace to={user ? "/admin" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
