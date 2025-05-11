import axios from 'axios';
import authHeader from './auth-header';

// URLs base para las APIs
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';
const AUTH_URL = `${BASE_URL}/auth`;
const ADMIN_URL = `${BASE_URL}/admin`;

/**
 * SERVICIOS PARA GESTIÓN DE USUARIOS
 */
const obtenerUsuarios = () => {
  console.log("URL de obtenerUsuarios:", `${ADMIN_URL}/users`);
  console.log("Headers:", authHeader());
  return axios.get(`${ADMIN_URL}/users`, { headers: authHeader() })
    .catch(error => {
      console.error("Error en obtenerUsuarios:", error);
      throw error;
    });
};

const obtenerUsuarioPorId = (id) => {
  return axios.get(`${ADMIN_URL}/users/${id}`, { headers: authHeader() })
    .catch(error => {
      console.error("Error en obtenerUsuarioPorId:", error);
      throw error;
    });
};

const crearUsuario = (usuario) => {
  return axios.post(`${AUTH_URL}/signup`, usuario)
    .catch(error => {
      console.error("Error en crearUsuario:", error);
      throw error;
    });
};

const actualizarUsuario = (id, usuario) => {
  return axios.put(`${ADMIN_URL}/users/${id}`, usuario, { headers: authHeader() })
    .catch(error => {
      console.error("Error en actualizarUsuario:", error);
      throw error;
    });
};

const eliminarUsuario = (id) => {
  return axios.delete(`${ADMIN_URL}/users/${id}`, { headers: authHeader() })
    .catch(error => {
      console.error("Error en eliminarUsuario:", error);
      throw error;
    });
};

const obtenerRoles = () => {
  return axios.get(`${AUTH_URL}/roles`, { headers: authHeader() })
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
