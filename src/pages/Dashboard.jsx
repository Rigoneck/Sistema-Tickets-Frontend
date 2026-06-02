import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Dashboard.css';

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

    const eliminarTicket = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este ticket?')) {
            try {
                await api.delete(`/tickets/${id}`);
                obtenerTickets();
            } catch (err) {
                setError('Error al eliminar el ticket.');
            }
        }
    };

    const cambiarEstado = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'Abierto' ? 'Cerrado' : 'Abierto';

        try {
            await api.put(`/tickets/${id}`, { estado: nuevoEstado });
            obtenerTickets();
        } catch (err) {
            setError('Error al actualizar el estado.');
        }
    };

    const totalTickets = tickets.length;
    const ticketsAbiertos = tickets.filter(ticket => ticket.estado === 'Abierto').length;
    const ticketsCerrados = tickets.filter(ticket => ticket.estado === 'Cerrado').length;

    if (cargando) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <h2>Cargando tus tickets...</h2>
            </div>
        );
    }

    return (
        <main className="dashboard-page">
            <section className="dashboard-hero">
                <div className="hero-icon">🎟️</div>

                <div>
                    <h1>Panel de tickets</h1>
                    <p>Administra, consulta y da seguimiento a tus solicitudes.</p>
                </div>

                <button className="logout-btn" onClick={logout}>
                    Cerrar sesión
                </button>
            </section>

            {error && <div className="dashboard-error">{error}</div>}

            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">🎫</div>
                    <div>
                        <span>Total</span>
                        <strong>{totalTickets}</strong>
                        <p>Tickets creados</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">✅</div>
                    <div>
                        <span>Abiertos</span>
                        <strong>{ticketsAbiertos}</strong>
                        <p>Pendientes de atención</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">✔</div>
                    <div>
                        <span>Cerrados</span>
                        <strong>{ticketsCerrados}</strong>
                        <p>Solicitudes resueltas</p>
                    </div>
                </div>
            </section>

            <section className="dashboard-grid">
                <div className="panel-card">
                    <div className="panel-title">
                        <span>👤</span>
                        <div>
                            <h2>Crear nuevo ticket</h2>
                            <p>Describe el problema y agrega evidencia si es necesario.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="ticket-form">
                        <label>
                            Asunto
                            <input
                                type="text"
                                placeholder="Ej. Error al iniciar sesión"
                                value={asunto}
                                onChange={(e) => setAsunto(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Descripción
                            <textarea
                                placeholder="Describe los detalles del problema..."
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Prioridad
                            <select
                                value={prioridad}
                                onChange={(e) => setPrioridad(e.target.value)}
                            >
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                                <option value="Crítica">Crítica</option>
                            </select>
                        </label>

                        <label className="file-box">
                            <span className="file-icon">☁️</span>
                            <strong>
                                {evidencia ? evidencia.name : 'Selecciona un archivo'}
                            </strong>
                            <small>Formatos: JPG, PNG, PDF</small>
                            <input
                                type="file"
                                onChange={(e) => setEvidencia(e.target.files[0])}
                            />
                        </label>

                        <button type="submit" className="primary-btn">
                            Enviar ticket
                        </button>
                    </form>
                </div>

                <div className="panel-card history-card">
                    <div className="panel-title">
                        <span>🕘</span>
                        <div>
                            <h2>Historial de tickets</h2>
                            <p>Revisa el estado de tus reportes.</p>
                        </div>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📥</div>
                            <h3>No tienes tickets todavía</h3>
                            <p>Crea tu primer ticket usando el formulario.</p>
                        </div>
                    ) : (
                        <div className="tickets-list">
                            {tickets.map(ticket => (
                                <article
                                    key={ticket._id}
                                    className={`ticket-card ${ticket.estado === 'Cerrado' ? 'ticket-closed' : ''}`}
                                >
                                    <div className="ticket-top">
                                        <h3>{ticket.asunto}</h3>

                                        <div className="badges">
                                            <span className={`badge status-${ticket.estado?.toLowerCase()}`}>
                                                {ticket.estado}
                                            </span>

                                            <span className={`badge priority-${ticket.prioridad?.toLowerCase()}`}>
                                                {ticket.prioridad}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="ticket-description">
                                        {ticket.descripcion}
                                    </p>

                                    {ticket.evidencia && (
                                        <a
                                            href={`http://localhost:4000/uploads/${ticket.evidencia}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="evidence-link"
                                        >
                                            Ver evidencia adjunta
                                        </a>
                                    )}

                                    <div className="ticket-actions">
                                        <button
                                            className="secondary-btn"
                                            onClick={() => cambiarEstado(ticket._id, ticket.estado)}
                                        >
                                            Marcar como {ticket.estado === 'Abierto' ? 'Cerrado' : 'Abierto'}
                                        </button>

                                        <button
                                            className="danger-btn"
                                            onClick={() => eliminarTicket(ticket._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Dashboard;