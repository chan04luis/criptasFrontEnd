import { Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import Visitas from './pages/Visitas';
import Cambiar from './pages/Cambiar';
import Recuperar from './pages/Recuperar';
import Login from './pages/Login';
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './hooks/useAuth';
import ServicioDetalle from './pages/Servicios/ServicioDetalle';

const App = () => {
  const { token } = useAuth(); // Hook que verifica si el usuario tiene token

  return (
    <AuthProvider>
      <Routes>
        <Route path="/servicio/:id" element={<ServicioDetalle />} />
        {/* Si el usuario tiene un token, se le permite acceder a /admin y /visitas */}
        <Route path="/admin/*" element={token ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/visitas" element={token ? <Visitas /> : <Navigate to="/login" />} />

        {/* Si no tiene token, se redirige a /login */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/admin" />} />

        {/* Rutas para cambiar y recuperar, solo accesibles sin token */}
        <Route path="/cambiar" element={!token ? <Cambiar /> : <Navigate to="/admin" />} />
        <Route path="/recuperar" element={!token ? <Recuperar /> : <Navigate to="/admin" />} />

        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>

  );
};

export default App;
