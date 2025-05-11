import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ServicioUsuarios from '../../services/usuario.service';
import './ListaUsuarios.css';

const FormularioUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: []
  });
  
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  
  useEffect(() => {    // Cargar los roles disponibles
    const cargarRoles = async () => {
      try {
        const response = await ServicioUsuarios.obtenerRoles();
        console.log('Datos de roles recibidos:', response.data);
        setRoles(response.data);
      } catch (err) {
        console.error("Error al cargar roles:", err);
        setError("No se pudieron cargar los roles disponibles");
      }
    };
    
    // Cargar datos del usuario si estamos en modo edición
    const cargarUsuario = async () => {
      if (!esEdicion) return;
      
      try {
        setLoading(true);
        const response = await ServicioUsuarios.obtenerUsuarioPorId(id);
        const usuario = response.data;
        
        setFormData({
          username: usuario.username || '',
          email: usuario.email || '',
          password: '', // No mostramos la contraseña por seguridad
          roles: usuario.roles?.map(role => role.name) || []
        });
        
        setError(null);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        setError("No se pudo cargar la información del usuario");
      } finally {
        setLoading(false);
      }
    };
    
    cargarRoles();
    if (esEdicion) {
      cargarUsuario();
    }
  }, [id, esEdicion]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Agregar el rol si no está en la lista
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, value]
      }));
    } else {
      // Quitar el rol si está en la lista
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.filter(rol => rol !== value)
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }
    
    if (!formData.email.trim()) {
      setError("El email es obligatorio");
      return;
    }
    
    if (!esEdicion && !formData.password.trim()) {
      setError("La contraseña es obligatoria para nuevos usuarios");
      return;
    }
    
    // Si no se seleccionó ningún rol, asignar rol de usuario por defecto
    if (formData.roles.length === 0) {
      formData.roles = ["user"];
    }
    
    try {
      setLoading(true);
      
      if (esEdicion) {
        // Si estamos editando y no se cambió la contraseña, no la enviamos
        const datosActualizados = {...formData};
        if (!datosActualizados.password.trim()) {
          delete datosActualizados.password;
        }
        
        await ServicioUsuarios.actualizarUsuario(id, datosActualizados);
      } else {
        await ServicioUsuarios.crearUsuario(formData);
      }
      
      setExito(true);
      setError(null);
      
      // Redireccionar después de un momento
      setTimeout(() => {
        navigate('/usuarios');
      }, 1500);
      
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setError("No se pudo guardar el usuario. Verifique los datos e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && esEdicion) return <div className="loading">Cargando datos del usuario...</div>;
  
  return (
    <div className="formulario-container">
      <h2>{esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
      
      {error && <div className="error">{error}</div>}
      {exito && <div className="exito">El usuario se ha guardado correctamente.</div>}
      
      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo-form">
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="campo-form">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="campo-form">
          <label htmlFor="password">
            {esEdicion ? 'Contraseña (dejar en blanco para no cambiar):' : 'Contraseña:'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!esEdicion}
          />
        </div>
        
        <div className="campo-form">
          <label>Roles:</label>
          <div className="opciones-roles">
            {roles.map(rol => (
              <div key={rol.id} className="opcion-rol">
                <input
                  type="checkbox"
                  id={`rol-${rol.name}`}
                  value={rol.name}
                  checked={formData.roles.includes(rol.name)}
                  onChange={handleRoleChange}
                />
                <label htmlFor={`rol-${rol.name}`}>{rol.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="acciones-form">
          <button type="button" onClick={() => navigate('/usuarios')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-guardar" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioUsuario;
