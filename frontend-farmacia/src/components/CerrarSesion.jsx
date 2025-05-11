import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServicioAutenticacion from '../services/auth.service';
import './CerrarSesion.css';

const CerrarSesion = () => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    // Confirmar si el usuario realmente quiere cerrar sesión
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      // Llamar al servicio de autenticación para cerrar sesión
      ServicioAutenticacion.cerrarSesion();
      
      // Mostrar una notificación al usuario
      alert('Has cerrado sesión exitosamente');
      
      // Redirigir al login (esto es opcional ya que el servicio ya hace la redirección)
      navigate('/login');
    }
  };

  return (
    <button className="boton-cerrar-sesion" onClick={handleCerrarSesion}>
      Cerrar Sesión
    </button>
  );
};

export default CerrarSesion;
