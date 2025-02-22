import { Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import Visitas from './pages/Visitas';
import Cambiar from './pages/Cambiar';
import Recuperar from './pages/Recuperar';
import Login from './pages/Login';
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { token } = useAuth(); // Hook que verifica si el usuario tiene token

  return (
    <AuthProvider>
      <Routes>
        {/* Si el usuario tiene un token, se le permite acceder a /admin y /visitas */}
        <Route path="/admin/*" element={token != null ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/visitas" element={token != null ? <Visitas /> : <Navigate to="/login" />} />

        {/* Si no tiene token, se redirige a /login */}
        <Route path="/login" element={token != null ? <Navigate to="/admin" /> : <Login />} />

        {/* Rutas para cambiar y recuperar, solo accesibles sin token */}
        <Route path="/cambiar" element={token != null ? <Navigate to="/admin" /> : <Cambiar />} />
        <Route path="/recuperar" element={token != null ? <Navigate to="/admin" /> : <Recuperar />} />

        {/* Ruta raíz */}
        <Route path="/" element={token != null ? <Navigate to="/admin" /> : <Navigate to="/login" />} />
      </Routes>
    </AuthProvider>

  );
};

export default App;
