import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CerrarSesion from './CerrarSesion';
import ServicioAutenticacion from '../services/auth.service';
import './BarraNavegacion.css';

const BarraNavegacion = () => {
  const estaAutenticado = ServicioAutenticacion.estaAutenticado();
  const usuarioActual = estaAutenticado ? ServicioAutenticacion.obtenerUsuarioActual() : null;
  const esAdmin = usuarioActual?.roles?.includes('ROLE_ADMIN');
  const esModerador = usuarioActual?.roles?.includes('ROLE_MODERATOR');
  const location = useLocation();
  
  // Función para determinar si un enlace está activo
  const enlaceActivo = (ruta) => {
    return location.pathname.startsWith(ruta) ? 'enlace activo' : 'enlace';
  };

  return (
    <nav className="barra-navegacion">
      <div className="logo">
        <Link to="/">Sistema de Farmacia</Link>
      </div>
      
      <div className="enlaces">
        {estaAutenticado ? (
          <>
            <Link to="/dashboard" className={enlaceActivo('/dashboard')}>Dashboard</Link>
            
            {/* Enlaces del sistema, mostrados según rol */}
            <Link to="/medicamentos" className={enlaceActivo('/medicamentos')}>Medicamentos</Link>
            
            {/* Solo para administradores */}
            {esAdmin && (
              <Link to="/laboratorios" className={enlaceActivo('/laboratorios')}>Laboratorios</Link>
            )}
            
            <Link to="/ordenes-compra" className={enlaceActivo('/ordenes-compra')}>Órdenes de Compra</Link>
              {/* Solo para administradores */}
            {esAdmin && (
              <Link to="/usuarios" className={enlaceActivo('/usuarios')}>Usuarios</Link>
            )}
            
            {/* Solo para moderadores y administradores */}
            {(esAdmin || esModerador) && (
              <Link to="/actividades" className={enlaceActivo('/actividades')}>Actividad Reciente</Link>
            )}
            
            <div className="usuario-info">
              <span>Hola, {usuarioActual.username}</span>
              <CerrarSesion />
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className={enlaceActivo('/login')}>Iniciar Sesión</Link>
            <Link to="/registro" className={enlaceActivo('/registro')}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default BarraNavegacion;
