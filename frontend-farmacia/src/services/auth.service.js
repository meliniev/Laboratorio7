import axios from 'axios';

// URL base de la API - Asegúrate que el servidor esté corriendo en este puerto
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth/';

const registrar = (username, email, password) => {
  return axios.post(`${API_URL}signup`, { username, email, password });
};

const iniciarSesion = (username, password) => {
  return axios
    .post(`${API_URL}signin`, { username, password })
    .then(response => {
      if (response.data.accessToken) {
        localStorage.setItem('usuario', JSON.stringify(response.data));
      }
      return response.data;
    })
    .catch(error => {
      console.error('Error en iniciarSesion:', error);
      throw error;
    });
};

const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  // Opcionalmente, podemos redirigir al usuario a la página de login
  window.location.href = '/login';
};

// Verificar si el usuario está autenticado
const estaAutenticado = () => {
  return !!localStorage.getItem('usuario');
};

// Obtener datos del usuario actual
const obtenerUsuarioActual = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

const ServicioAutenticacion = { 
  registrar, 
  iniciarSesion, 
  cerrarSesion, 
  estaAutenticado, 
  obtenerUsuarioActual 
};

export default ServicioAutenticacion;