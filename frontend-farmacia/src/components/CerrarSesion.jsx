import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicioAutenticacion from '../services/auth.service';
import { NotificacionProvider } from './notificaciones/Notificacion';
import './CerrarSesion.css';

const CerrarSesion = () => {
  const navigate = useNavigate();
  const { exito } = useContext(NotificacionProvider);

  const handleCerrarSesion = () => {
    ServicioAutenticacion.cerrarSesion();
    
    exito('Has cerrado sesión exitosamente', 2000);
    
    navigate('/login');
  };

  return (
    <button className="boton-cerrar-sesion" onClick={handleCerrarSesion}>
      Cerrar Sesión
    </button>
  );
};

export default CerrarSesion;
