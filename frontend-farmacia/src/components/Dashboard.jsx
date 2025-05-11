import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ServicioAutenticacion from '../services/auth.service';
import ServicioFarmacia from '../services/farmacia.service';
import './Dashboard.css';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    medicamentos: 0,
    laboratorios: 0,
    ordenes: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación al cargar el componente
    const usuarioActual = ServicioAutenticacion.obtenerUsuarioActual();
    if (!usuarioActual) {
      navigate('/login');
      return;
    }
    
    setUsuario(usuarioActual);
    cargarEstadisticas();
  }, [navigate]);

  const cargarEstadisticas = async () => {
    try {
      // Cargar contadores de elementos en el sistema
      const [resMedicamentos, resLaboratorios, resOrdenes] = await Promise.all([
        ServicioFarmacia.obtenerMedicamentos().catch(() => ({ data: [] })),
        ServicioFarmacia.obtenerLaboratorios().catch(() => ({ data: [] })),
        ServicioFarmacia.obtenerOrdenesCompra().catch(() => ({ data: [] }))
      ]);

      setStats({
        medicamentos: resMedicamentos.data.length,
        laboratorios: resLaboratorios.data.length,
        ordenes: resOrdenes.data.length
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div className="cargando">Cargando panel de control...</div>;
  }

  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');

  return (
    <div className="dashboard-container">
      <h1>Panel de Control</h1>
      <div className="welcome-message">
        Bienvenido, <strong>{usuario?.username}</strong>
      </div>
      
      {/* Resumen de estadísticas */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{stats.medicamentos}</div>
          <div className="stat-label">Medicamentos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.laboratorios}</div>
          <div className="stat-label">Laboratorios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.ordenes}</div>
          <div className="stat-label">Órdenes de Compra</div>
        </div>
      </div>
      
      <h2 className="dashboard-section-title">Accesos Rápidos</h2>
      <div className="dashboard-cards">
        {/* Tarjeta de Medicamentos - Visible para todos */}
        <div className="dashboard-card" onClick={() => navigate('/medicamentos')}>
          <h3>Medicamentos</h3>
          <p>Ver el catálogo de medicamentos disponibles</p>
          <div className="card-actions">
            <Link to="/medicamentos" className="card-link">Ver Medicamentos</Link>
            {esAdmin && (
              <Link to="/medicamentos/nuevo" className="card-link">Añadir Nuevo</Link>
            )}
          </div>
        </div>
        
        {/* Tarjeta de Laboratorios - Visible solo para administradores */}
        {esAdmin && (
          <div className="dashboard-card" onClick={() => navigate('/laboratorios')}>
            <h3>Laboratorios</h3>
            <p>Gestionar los laboratorios proveedores</p>
            <div className="card-actions">
              <Link to="/laboratorios" className="card-link">Ver Laboratorios</Link>
              <Link to="/laboratorios/nuevo" className="card-link">Añadir Nuevo</Link>
            </div>
          </div>
        )}
          {/* Tarjeta de Órdenes de Compra - Visible para todos */}
        <div className="dashboard-card" onClick={() => navigate('/ordenes-compra')}>
          <h3>Órdenes de Compra</h3>
          <p>Gestionar las órdenes de compra de medicamentos</p>
          <div className="card-actions">
            <Link to="/ordenes-compra" className="card-link">Ver Órdenes</Link>
            <Link to="/ordenes-compra/nueva" className="card-link">Nueva Orden</Link>
          </div>
        </div>
        
        {/* Tarjeta de Usuarios - Solo para administradores */}
        {esAdmin && (
          <div className="dashboard-card" onClick={() => navigate('/usuarios')}>
            <h3>Gestión de Usuarios</h3>
            <p>Administrar los usuarios del sistema</p>
            <div className="card-actions">
              <Link to="/usuarios" className="card-link">Ver Usuarios</Link>
              <Link to="/usuarios/nuevo" className="card-link">Añadir Usuario</Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Actividad reciente - para una futura implementación */}
      <h2 className="dashboard-section-title">Actividad Reciente</h2>
      <div className="activity-container">
        <p className="no-activity">No hay actividad reciente para mostrar.</p>
      </div>
    </div>
  );
};

export default Dashboard;
