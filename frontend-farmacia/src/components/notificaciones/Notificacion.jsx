import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import './Notificacion.css';

// Componente para mostrar notificaciones en la aplicación
const Notificacion = ({ tipo, mensaje, duracion = 3000, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Auto-ocultar la notificación después de la duración especificada
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duracion);

    return () => clearTimeout(timer);
  }, [duracion, onClose]);

  // Determinar el estilo según el tipo de notificación
  const getBgClass = () => {
    switch (tipo) {
      case 'success': return 'bg-success';
      case 'danger': return 'bg-danger';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-primary';
    }
  };

  // Determinar el icono según el tipo de notificación
  const getIcon = () => {
    switch (tipo) {
      case 'success': return '✅';
      case 'danger': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3 notificacion-container">
      <Toast 
        onClose={() => {
          setShow(false);
          if (onClose) onClose();
        }} 
        show={show} 
        delay={duracion} 
        autohide
        className={`notificacion ${getBgClass()}`}
      >
        <Toast.Header closeButton={true}>
          <strong className="me-auto">{getIcon()} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}</strong>
          <small>ahora</small>
        </Toast.Header>
        <Toast.Body>{mensaje}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

// Componente para gestionar múltiples notificaciones
export const NotificacionProvider = React.createContext(null);

export const NotificacionContextProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  // Añadir una nueva notificación
  const mostrarNotificacion = (tipo, mensaje, duracion = 3000) => {
    const id = Date.now();
    setNotificaciones(prev => [...prev, { id, tipo, mensaje, duracion }]);
    return id;
  };

  // Eliminar una notificación específica
  const eliminarNotificacion = (id) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  };

  // Métodos de conveniencia para tipos comunes de notificaciones
  const exito = (mensaje, duracion) => mostrarNotificacion('success', mensaje, duracion);
  const error = (mensaje, duracion) => mostrarNotificacion('danger', mensaje, duracion);
  const advertencia = (mensaje, duracion) => mostrarNotificacion('warning', mensaje, duracion);
  const info = (mensaje, duracion) => mostrarNotificacion('info', mensaje, duracion);

  return (
    <NotificacionProvider.Provider 
      value={{ 
        mostrarNotificacion, 
        eliminarNotificacion,
        exito,
        error,
        advertencia,
        info
      }}
    >
      {children}
      <div className="notificaciones-wrapper">
        {notificaciones.map(n => (
          <Notificacion
            key={n.id}
            tipo={n.tipo}
            mensaje={n.mensaje}
            duracion={n.duracion}
            onClose={() => eliminarNotificacion(n.id)}
          />
        ))}
      </div>
    </NotificacionProvider.Provider>
  );
};

export default Notificacion;
