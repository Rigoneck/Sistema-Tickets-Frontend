import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    
    const [tickets, setTickets] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const [asunto, setAsunto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [prioridad, setPrioridad] = useState('Baja');
    const [evidencia, setEvidencia] = useState(null);

    useEffect(() => {
        obtenerTickets();
    }, []);

    const obtenerTickets = async () => {
        try {
            setCargando(true);
            const res = await api.get('/tickets');
            setTickets(res.data);
            setError('');
        } catch (err) {
            setError('Error al cargar los tickets de soporte.');
        } finally {
            setCargando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('asunto', asunto);
            data.append('descripcion', descripcion);
            data.append('prioridad', prioridad);
            if (evidencia) data.append('evidencia', evidencia);

            await api.post('/tickets', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setAsunto('');
            setDescripcion('');
            setPrioridad('Baja');
            setEvidencia(null);
            obtenerTickets();
        } catch (err) {
            setError('Error al crear el ticket. Intenta nuevamente.');
        }
    };

    // NUEVO: Función para eliminar un ticket
    const eliminarTicket = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este ticket?')) {
            try {
                await api.delete(`/tickets/${id}`);
                obtenerTickets(); // Recargamos la lista
            } catch (err) {
                setError('Error al eliminar el ticket.');
            }
        }
    };

    // NUEVO: Función para cambiar el estado de Abierto a Cerrado
    const cambiarEstado = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'Abierto' ? 'Cerrado' : 'Abierto';
        try {
            await api.put(`/tickets/${id}`, { estado: nuevoEstado });
            obtenerTickets(); // Recargamos la lista
        } catch (err) {
            setError('Error al actualizar el estado.');
        }
    };

    if (cargando) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Cargando tus tickets... ⏳</h2>;

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Mis Tickets de Soporte</h2>
                <button onClick={logout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                    Cerrar Sesión
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ backgroundColor: '#f4f4f4', padding: '20px', marginTop: '20px', borderRadius: '8px', color: 'black' }}>
                <h3 style={{ marginTop: 0 }}>Crear Nuevo Ticket</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Asunto del problema" value={asunto} onChange={(e) => setAsunto(e.target.value)} required style={{ padding: '10px' }} />
                    <textarea placeholder="Describe los detalles..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required style={{ padding: '10px', minHeight: '80px' }} />
                    
                    <label>Prioridad:</label>
                    <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} style={{ padding: '10px' }}>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                    </select>

                    <label>Subir evidencia (Opcional):</label>
                    <input type="file" onChange={(e) => setEvidencia(e.target.files[0])} />

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                        Enviar Ticket
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3>Historial de Tickets</h3>
                {tickets.length === 0 ? (
                    <p>No tienes tickets creados aún. ¡Crea el primero arriba!</p>
                ) : (
                    tickets.map(ticket => (
                        <div key={ticket._id} style={{ border: '1px solid #444', padding: '15px', marginTop: '15px', borderRadius: '5px', opacity: ticket.estado === 'Cerrado' ? 0.6 : 1 }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#007bff', textDecoration: ticket.estado === 'Cerrado' ? 'line-through' : 'none' }}>{ticket.asunto}</h4>
                            <p style={{ margin: 0 }}><strong>Estado:</strong> {ticket.estado} | <strong>Prioridad:</strong> {ticket.prioridad}</p>
                            <p>{ticket.descripcion}</p>
                            
                            {ticket.evidencia && (
                                <a href={`http://localhost:4000/uploads/${ticket.evidencia}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '10px', color: '#28a745' }}>
                                    📷 Ver Evidencia Adjunta
                                </a>
                            )}

                            {/* Botones de Acción (Actualizar y Eliminar) */}
                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                <button onClick={() => cambiarEstado(ticket._id, ticket.estado)} style={{ padding: '5px 10px', backgroundColor: ticket.estado === 'Abierto' ? '#ffc107' : '#17a2b8', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                                    Marcar como {ticket.estado === 'Abierto' ? 'Cerrado' : 'Abierto'}
                                </button>
                                <button onClick={() => eliminarTicket(ticket._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;