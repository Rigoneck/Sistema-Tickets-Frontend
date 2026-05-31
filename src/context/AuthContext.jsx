import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// Creamos el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Este useEffect revisa si ya hay un token cuando el usuario recarga la página
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUsuario({ token });
        }
        setCargando(false);
    }, []);

    // Función para iniciar sesión
    const login = async (datos) => {
        try {
            const res = await api.post('/auth/login', datos);
            // Guardamos el token en el navegador
            localStorage.setItem('token', res.data.token);
            setUsuario({ token: res.data.token });
            return true; // Retornamos true si el login fue exitoso
        } catch (error) {
            console.error(error.response.data.mensaje);
            return false;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('token');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};