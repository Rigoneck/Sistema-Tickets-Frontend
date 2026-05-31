import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { usuario, cargando } = useContext(AuthContext);

    // Mientras revisa si hay token en el localStorage, mostramos un mensaje de carga
    if (cargando) return <div>Cargando sistema...</div>;

    // Si no hay usuario activo, lo redirigimos al login
    if (!usuario) return <Navigate to="/login" replace />;

    // Si todo está bien, lo dejamos pasar a la ruta que solicitó (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;