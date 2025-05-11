import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/';

/**
 * SERVICIOS PARA GESTIÓN DE USUARIOS
 */
const obtenerUsuarios = () => {
  return axios.get(API_URL + 'admin/users', { headers: authHeader() })
    .catch(error => {
      console.error("Error en obtenerUsuarios:", error);
      throw error;
    });
};

const obtenerUsuarioPorId = (id) => {
  return axios.get(API_URL + `admin/users/${id}`, { headers: authHeader() })
    .catch(error => {
      console.error("Error en obtenerUsuarioPorId:", error);
      throw error;
    });
};

const crearUsuario = (usuario) => {
  return axios.post(API_URL + 'auth/signup', usuario)
    .catch(error => {
      console.error("Error en crearUsuario:", error);
      throw error;
    });
};

const actualizarUsuario = (id, usuario) => {
  return axios.put(API_URL + `admin/users/${id}`, usuario, { headers: authHeader() })
    .catch(error => {
      console.error("Error en actualizarUsuario:", error);
      throw error;
    });
};

const eliminarUsuario = (id) => {
  return axios.delete(API_URL + `admin/users/${id}`, { headers: authHeader() })
    .catch(error => {
      console.error("Error en eliminarUsuario:", error);
      throw error;
    });
};

const obtenerRoles = () => {
  return axios.get(API_URL + 'roles', { headers: authHeader() })
    .catch(error => {
      console.error("Error en obtenerRoles:", error);
      throw error;
    });
};

const ServicioUsuarios = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerRoles
};

export default ServicioUsuarios;
