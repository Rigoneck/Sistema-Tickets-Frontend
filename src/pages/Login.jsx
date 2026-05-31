import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    
    // Traemos la función de login de nuestro estado global
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiamos errores previos
        
        // Ejecutamos la función del AuthContext
        const exito = await login(formData);
        
        if (exito) {
            // Si el token se guardó bien, vamos al Dashboard
            navigate('/dashboard');
        } else {
            // Si no, mostramos error
            setError('Credenciales incorrectas o error en el servidor');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
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
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Entrar
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
        </div>
    );
};

export default Login;