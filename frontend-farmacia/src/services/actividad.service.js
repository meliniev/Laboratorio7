import axios from 'axios';
import authHeader from './auth-header';

// URL base de la API
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';
const ACTIVIDADES_URL = `${BASE_URL}/actividades`;

/**
 * Obtiene la lista de actividades recientes.
 * Solo usuarios con rol moderator o admin pueden acceder a esta información.
 * 
 * @param {Object} filtros - Filtros para la consulta
 * @param {string} filtros.tipo - Tipo de actividad (opcional)
 * @param {string} filtros.entidad - Entidad afectada (opcional)
 * @param {number} filtros.usuarioId - ID del usuario que realizó la acción (opcional)
 * @param {number} filtros.limit - Límite de registros a devolver (opcional, por defecto 50)
 * @param {number} filtros.offset - Posición desde donde empezar (opcional, por defecto 0)
 * @returns {Promise} - Promesa con la respuesta
 */
const obtenerActividades = (filtros = {}) => {
  // Construir parámetros de consulta
  const params = new URLSearchParams();
  if (filtros.tipo) params.append('tipo', filtros.tipo);
  if (filtros.entidad) params.append('entidad', filtros.entidad);
  if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
  if (filtros.limit) params.append('limit', filtros.limit);
  if (filtros.offset) params.append('offset', filtros.offset);

  const url = `${ACTIVIDADES_URL}?${params.toString()}`;  console.log("Consultando actividades:", url);
  console.log("Headers:", authHeader());
  
  return axios
    .get(url, { headers: authHeader() })
    .then(response => {
      console.log("Respuesta actividades:", response.data);
      return response.data;
    })
    .catch(error => {
      console.error("Error al obtener actividades:", error.response ? error.response.data : error.message);
      throw error;
    });
};

/**
 * Obtiene los tipos de actividades disponibles para filtrado
 */
const obtenerTiposActividad = () => {
  return [
    { value: 'login', label: 'Inicio de sesión' },
    { value: 'logout', label: 'Cierre de sesión' },
    { value: 'creacion', label: 'Creación' },
    { value: 'modificacion', label: 'Modificación' },
    { value: 'eliminacion', label: 'Eliminación' }
  ];
};

/**
 * Obtiene las entidades disponibles para filtrado
 */
const obtenerEntidades = () => {
  return [
    { value: 'usuario', label: 'Usuario' },
    { value: 'medicamento', label: 'Medicamento' },
    { value: 'laboratorio', label: 'Laboratorio' },
    { value: 'orden', label: 'Orden de compra' }
  ];
};

const ServicioActividades = {
  obtenerActividades,
  obtenerTiposActividad,
  obtenerEntidades
};

export default ServicioActividades;
