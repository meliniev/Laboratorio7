import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServicioFarmacia from '../../services/farmacia.service';
import ServicioAutenticacion from '../../services/auth.service';
import './Ordenes.css';

const ListaOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    const usuarioActual = ServicioAutenticacion.obtenerUsuarioActual();
    setUsuario(usuarioActual);
    
    cargarOrdenes();
  }, []);
  
  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const response = await ServicioFarmacia.obtenerOrdenesCompra();
      setOrdenes(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar órdenes de compra:", err);
      setError("No se pudieron cargar las órdenes de compra. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  const eliminarOrden = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta orden de compra? Esta acción no se puede deshacer.')) {
      try {
        await ServicioFarmacia.eliminarOrdenCompra(id);
        cargarOrdenes(); // Recargar la lista
        alert('Orden de compra eliminada con éxito.');
      } catch (err) {
        console.error("Error al eliminar orden de compra:", err);
        alert('No se pudo eliminar la orden de compra.');
      }
    }
  };
  
  // Función para formatear fechas
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString();
  };
  
  if (loading) return <div className="loading">Cargando órdenes de compra...</div>;
  if (error) return <div className="error">{error}</div>;
  
  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');
  
  return (
    <div className="ordenes-container">
      <div className="header-actions">
        <h2>Órdenes de Compra</h2>
        <Link to="/ordenes-compra/nueva" className="btn-nuevo">
          Nueva Orden
        </Link>
      </div>
      
      {ordenes.length === 0 ? (
        <p>No hay órdenes de compra registradas.</p>
      ) : (
        <div className="table-container">
          <table className="ordenes-tabla">            <thead>
              <tr>
                <th>Nro.</th>
                <th>Fecha Emisión</th>
                <th>Laboratorio</th>
                <th>Situación</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>              {ordenes.map((orden) => (
                <tr key={orden.NroOrdenC}>
                  <td>{orden.NroOrdenC}</td>
                  <td>{formatearFecha(orden.fechaEmision)}</td>
                  <td>{orden.Laboratorio?.razonSocial || 'N/A'}</td>
                  <td>
                    <span className={`estado estado-${orden.Situacion?.toLowerCase()}`}>
                      {orden.Situacion || 'Pendiente'}
                    </span>
                  </td>
                  <td>${orden.Total?.toFixed(2) || '0.00'}</td>
                  <td className="acciones">
                    <Link to={`/ordenes-compra/${orden.NroOrdenC}`} className="btn-ver">
                      Ver
                    </Link>
                    {esAdmin && (
                      <>
                        <Link to={`/ordenes-compra/editar/${orden.NroOrdenC}`} className="btn-editar">
                          Editar
                        </Link>
                        <button 
                          onClick={() => eliminarOrden(orden.NroOrdenC)} 
                          className="btn-eliminar"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
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

export default ListaOrdenes;
