import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Registro = () => {
    // Estado para guardar lo que el usuario escribe
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    // Estado para mostrar errores (Punto 8 de la rúbrica)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        try {
            // Mandamos los datos al backend
            await api.post('/auth/register', formData);
            // Si todo sale bien, lo mandamos al Login
            navigate('/login');
        } catch (err) {
            // Si el backend nos manda un error (ej. el correo ya existe), lo mostramos
            setError(err.response?.data?.mensaje || 'Hubo un error al registrarse');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h2>Registro de Usuario</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre completo" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Correo electrónico" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Contraseña" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Registrarse
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    );
};

export default Registro;