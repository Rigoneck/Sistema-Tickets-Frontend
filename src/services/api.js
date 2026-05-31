import axios from 'axios';

// Creamos una instancia de Axios apuntando a tu backend
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

// Interceptor de peticiones
api.interceptors.request.use(
    (config) => {
        // Buscamos el token en el almacenamiento local del navegador
        const token = localStorage.getItem('token');
        if (token) {
            // Si hay token, se lo agregamos a los headers exactamente como lo pide tu backend
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;