import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicioAutenticacion from '../services/auth.service';
import { NotificacionProvider } from './notificaciones/Notificacion';
import './CerrarSesion.css';

const CerrarSesion = () => {
  const navigate = useNavigate();
  const { exito } = useContext(NotificacionProvider);

  const handleCerrarSesion = () => {
    // Llamar al servicio de autenticación para cerrar sesión
    ServicioAutenticacion.cerrarSesion();
    
    // Mostrar una notificación al usuario
    exito('Has cerrado sesión exitosamente', 2000);
    
    // Redirigir al login (esto es opcional ya que el servicio ya hace la redirección)
    navigate('/login');
  };

  return (
    <button className="boton-cerrar-sesion" onClick={handleCerrarSesion}>
      Cerrar Sesión
    </button>
  );
};

export default CerrarSesion;
