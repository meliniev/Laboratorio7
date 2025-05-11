import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServicioFarmacia from '../../services/farmacia.service';
import ServicioAutenticacion from '../../services/auth.service';
import './Laboratorios.css';

const ListaLaboratorios = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    const usuarioActual = ServicioAutenticacion.obtenerUsuarioActual();
    setUsuario(usuarioActual);
    
    cargarLaboratorios();
  }, []);
  
  const cargarLaboratorios = async () => {
    try {
      setLoading(true);
      const response = await ServicioFarmacia.obtenerLaboratorios();
      setLaboratorios(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar laboratorios:", err);
      setError("No se pudieron cargar los laboratorios. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  const eliminarLaboratorio = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este laboratorio? Esta acción no se puede deshacer.')) {
      try {
        await ServicioFarmacia.eliminarLaboratorio(id);
        cargarLaboratorios(); // Recargar la lista
        alert('Laboratorio eliminado con éxito.');
      } catch (err) {
        console.error("Error al eliminar laboratorio:", err);
        alert('No se pudo eliminar el laboratorio. Puede que esté asociado a medicamentos.');
      }
    }
  };
  
  if (loading) return <div className="loading">Cargando laboratorios...</div>;
  if (error) return <div className="error">{error}</div>;
  
  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');
  
  return (
    <div className="laboratorios-container">
      <div className="header-actions">
        <h2>Lista de Laboratorios</h2>
        {esAdmin && (
          <Link to="/laboratorios/nuevo" className="btn-nuevo">
            Nuevo Laboratorio
          </Link>
        )}
      </div>
      
      {laboratorios.length === 0 ? (
        <p>No hay laboratorios registrados.</p>
      ) : (
        <div className="table-container">
          <table className="laboratorios-tabla">
            <thead>
              <tr>
                <th>ID</th>                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Contacto</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {laboratorios.map((laboratorio) => (                <tr key={laboratorio.id}>
                  <td>{laboratorio.id}</td>
                  <td>{laboratorio.nombre}</td>
                  <td>{laboratorio.direccion || 'N/A'}</td>
                  <td>{laboratorio.telefono || 'N/A'}</td>
                  <td>{laboratorio.email || 'N/A'}</td>
                  <td>{laboratorio.contacto || 'N/A'}</td>
                  {esAdmin && (
                    <td className="acciones">
                      <Link to={`/laboratorios/editar/${laboratorio.id}`} className="btn-editar">
                        Editar
                      </Link>
                      <button 
                        onClick={() => eliminarLaboratorio(laboratorio.id)} 
                        className="btn-eliminar"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaLaboratorios;
