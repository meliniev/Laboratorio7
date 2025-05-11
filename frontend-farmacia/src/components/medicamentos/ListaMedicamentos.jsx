import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServicioFarmacia from '../../services/farmacia.service';
import ServicioAutenticacion from '../../services/auth.service';
import './Medicamentos.css';

const ListaMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    const usuarioActual = ServicioAutenticacion.obtenerUsuarioActual();
    setUsuario(usuarioActual);
    
    cargarMedicamentos();
  }, []);
  
  const cargarMedicamentos = async () => {
    try {
      setLoading(true);
      const response = await ServicioFarmacia.obtenerMedicamentos();
      setMedicamentos(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar medicamentos:", err);
      setError("No se pudieron cargar los medicamentos. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  const eliminarMedicamento = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este medicamento?')) {
      try {
        await ServicioFarmacia.eliminarMedicamento(id);
        cargarMedicamentos(); // Recargar la lista
        alert('Medicamento eliminado con éxito.');
      } catch (err) {
        console.error("Error al eliminar medicamento:", err);
        alert('No se pudo eliminar el medicamento.');
      }
    }
  };
  
  if (loading) return <div className="loading">Cargando medicamentos...</div>;
  if (error) return <div className="error">{error}</div>;
  
  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');
  
  return (
    <div className="medicamentos-container">
      <div className="header-actions">
        <h2>Lista de Medicamentos</h2>
        {esAdmin && (
          <Link to="/medicamentos/nuevo" className="btn-nuevo">
            Nuevo Medicamento
          </Link>
        )}
      </div>
      
      {medicamentos.length === 0 ? (
        <p>No hay medicamentos registrados.</p>
      ) : (
        <div className="table-container">
          <table className="medicamentos-tabla">            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Presentación</th>
                <th>Marca</th>
                <th>Precio Unitario</th>
                <th>Stock</th>
                <th>Laboratorio</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {medicamentos.map((medicamento) => (
                <tr key={medicamento.CodMedicamento}>
                  <td>{medicamento.CodMedicamento}</td>
                  <td>{medicamento.descripcionMed}</td>
                  <td>{medicamento.Presentacion || 'N/A'}</td>
                  <td>{medicamento.Marca || 'N/A'}</td>
                  <td>${medicamento.precioVentaUni}</td>
                  <td>{medicamento.stock}</td>
                  <td>{medicamento.Laboratorio?.razonSocial || 'N/A'}</td>
                  {esAdmin && (
                    <td className="acciones">
                      <Link to={`/medicamentos/editar/${medicamento.CodMedicamento}`} className="btn-editar">
                        Editar
                      </Link>
                      <button 
                        onClick={() => eliminarMedicamento(medicamento.CodMedicamento)} 
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

export default ListaMedicamentos;
