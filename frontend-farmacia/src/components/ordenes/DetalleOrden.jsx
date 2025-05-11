import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ServicioFarmacia from '../../services/farmacia.service';
import ServicioAutenticacion from '../../services/auth.service';
import './Ordenes.css';

const DetalleOrden = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [orden, setOrden] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  
  // Usamos useCallback para memorizar la función cargarOrden
  const cargarOrden = useCallback(async () => {
    try {
      setLoading(true);
      // Cargar la orden
      const responseOrden = await ServicioFarmacia.obtenerOrdenCompraPorId(id);
      setOrden(responseOrden.data);
      
      // Si la orden tiene detalles incluidos, usamos esos directamente
      if (responseOrden.data.DetalleOrdenCompras && responseOrden.data.DetalleOrdenCompras.length > 0) {
        setDetalles(responseOrden.data.DetalleOrdenCompras);
      } else {
        // Si no, cargamos los detalles por separado (este caso debería ser raro)
        const responseDetalles = await ServicioFarmacia.obtenerDetallesOrden();
        // Filtrar solo los detalles que pertenecen a esta orden
        const detallesOrden = responseDetalles.data.filter(
          detalle => detalle.NroOrdenC === parseInt(id)
        );
        setDetalles(detallesOrden);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error al cargar la orden y sus detalles:", err);
      setError("No se pudo cargar la información de la orden de compra.");
    } finally {
      setLoading(false);
    }
  }, [id]); // Dependencia: id

  useEffect(() => {
    const usuarioActual = ServicioAutenticacion.obtenerUsuarioActual();
    setUsuario(usuarioActual);
    
    cargarOrden();
  }, [cargarOrden]); // Incluimos cargarOrden como dependencia
  
  
  // Función para formatear fechas
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString();
  };
    if (loading) return <div className="loading">Cargando detalles de la orden...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!orden) return <div className="error">No se encontró la orden de compra.</div>;
  
  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');
  // Calculamos el total de la orden a partir de los detalles
  const total = detalles.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
  
  return (
    <div className="detalle-orden-container">
      <div className="header-actions">
        <h2>Orden de Compra #{orden.NroOrdenC}</h2>
        <div>
          <button onClick={() => navigate('/ordenes-compra')} className="btn-volver">
            Volver a la Lista
          </button>
          {esAdmin && (
            <Link to={`/ordenes-compra/editar/${orden.NroOrdenC}`} className="btn-editar ml-2">
              Editar Orden
            </Link>
          )}
        </div>
      </div>
      
      <div className="orden-info">
        <div className="orden-encabezado">
          <div className="orden-meta">
            <p><strong>Fecha Emisión:</strong> {formatearFecha(orden.fechaEmision)}</p>
            <p><strong>Laboratorio:</strong> {orden.Laboratorio?.razonSocial || 'N/A'}</p>
            <p><strong>Factura Proveedor:</strong> {orden.NrofacturaProv || 'N/A'}</p>
            <p>
              <strong>Situación:</strong> 
              <span className={`estado estado-${orden.Situacion?.toLowerCase()}`}>
                {orden.Situacion || 'Pendiente'}
              </span>
            </p>
          </div>
          <div className="orden-total">
            <h3>Total: ${parseFloat(orden.Total || total).toFixed(2)}</h3>
          </div>
        </div>
          <div className="detalles-orden">
          <h3>Detalles de la Orden</h3>
          
          {detalles.length === 0 ? (
            <p>No hay productos en esta orden.</p>
          ) : (
            <table className="detalles-tabla">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Monto Unitario</th>
                  <th>Subtotal</th>
                  {esAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => (
                  <tr key={`${detalle.NroOrdenC}-${detalle.CodMedicamento}`}>
                    <td>{detalle.Medicamento?.descripcionMed || `Medicamento #${detalle.CodMedicamento}`}</td>
                    <td>{detalle.descripcion || 'N/A'}</td>
                    <td>{detalle.cantidad}</td>
                    <td>${parseFloat(detalle.precio).toFixed(2)}</td>
                    <td>${parseFloat(detalle.montouni).toFixed(2)}</td>
                    <td>${(detalle.cantidad * detalle.precio).toFixed(2)}</td>
                    {esAdmin && (
                      <td className="acciones">
                        <button 
                          className="btn-eliminar"
                          onClick={() => {
                            // Aquí iría la lógica para eliminar un detalle
                            alert('Funcionalidad para eliminar detalle aún no implementada');
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={esAdmin ? "5" : "4"} className="text-right"><strong>Total:</strong></td>
                  <td colSpan={esAdmin ? "2" : "3"}><strong>${parseFloat(orden.Total || total).toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          )}
          
          {esAdmin && (
            <div className="acciones-detalles">              <button 
                className="btn-nuevo"
                onClick={() => {
                  // Aquí iría la navegación para añadir un nuevo detalle
                  navigate(`/ordenes-compra/${orden.NroOrdenC}/agregar-medicamento`);
                }}
              >
                Agregar Medicamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleOrden;
