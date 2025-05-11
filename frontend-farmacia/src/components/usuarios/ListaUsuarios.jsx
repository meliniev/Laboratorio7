import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServicioUsuarios from '../../services/usuario.service';
import ServicioAutenticacion from '../../services/auth.service';
import './ListaUsuarios.css';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
    useEffect(() => {
    const usuarioActual = ServicioAutenticacion.obtenerUsuarioActual();
    console.log("Usuario actual:", usuarioActual);
    console.log("Roles del usuario:", usuarioActual?.roles);
    setUsuario(usuarioActual);
    
    cargarUsuarios();
  }, []);
    const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await ServicioUsuarios.obtenerUsuarios();
      console.log('Datos de usuarios recibidos:', response.data);
      setUsuarios(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("No se pudieron cargar los usuarios. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await ServicioUsuarios.eliminarUsuario(id);
        cargarUsuarios(); // Recargar la lista
        alert('Usuario eliminado con éxito.');
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        alert('No se pudo eliminar el usuario. Puede que no tengas permisos suficientes.');
      }
    }
  };
  
  if (loading) return <div className="loading">Cargando usuarios...</div>;
  if (error) return <div className="error">{error}</div>;
    // Verificar si el usuario actual es administrador
  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');
  console.log("¿Es administrador?", esAdmin);
  
  // Si no es administrador, no debería ver esta página
  if (!esAdmin) {
    return <div className="error">No tienes permisos para acceder a esta página.</div>;
  }
  
  return (
    <div className="usuarios-container">
      <div className="header-actions">
        <h2>Gestión de Usuarios</h2>
        <Link to="/usuarios/nuevo" className="btn-nuevo">
          Nuevo Usuario
        </Link>
      </div>
      
      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div className="table-container">
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de Usuario</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.username}</td>
                  <td>{usuario.email}</td>
                  <td>
                    {usuario.roles?.map(role => role.name).join(', ') || 'Usuario'}
                  </td>
                  <td className="acciones">
                    <Link to={`/usuarios/editar/${usuario.id}`} className="btn-editar">
                      Editar
                    </Link>
                    <button 
                      onClick={() => eliminarUsuario(usuario.id)} 
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaUsuarios;
