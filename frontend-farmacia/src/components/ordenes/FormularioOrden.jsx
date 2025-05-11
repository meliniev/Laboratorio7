import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ServicioFarmacia from '../../services/farmacia.service';
import './Ordenes.css';

const FormularioOrden = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;
  
  const [formData, setFormData] = useState({
    fechaEmision: new Date().toISOString().split('T')[0],
    Situacion: 'Pendiente',
    Total: '0.00',
    NrofacturaProv: '',
    CodLab: ''
  });
  
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  
  useEffect(() => {
    const cargarLaboratorios = async () => {
      try {
        const response = await ServicioFarmacia.obtenerLaboratorios();
        setLaboratorios(response.data);
      } catch (err) {
        console.error("Error al cargar laboratorios:", err);
        setError("No se pudieron cargar los laboratorios");
      }
    };
    
    const cargarOrden = async () => {
      if (!esEdicion) return;
      
      try {
        setLoading(true);
        const response = await ServicioFarmacia.obtenerOrdenCompraPorId(id);
        const orden = response.data;
        
        setFormData({
          fechaEmision: orden.fechaEmision ? new Date(orden.fechaEmision).toISOString().split('T')[0] : '',
          Situacion: orden.Situacion || 'Pendiente',
          Total: orden.Total ? orden.Total.toString() : '0.00',
          NrofacturaProv: orden.NrofacturaProv || '',
          CodLab: orden.CodLab ? orden.CodLab.toString() : ''
        });
        
        setError(null);
      } catch (err) {
        console.error("Error al cargar la orden:", err);
        setError("No se pudo cargar la información de la orden de compra");
      } finally {
        setLoading(false);
      }
    };
    
    cargarLaboratorios();
    if (esEdicion) {
      cargarOrden();
    }
  }, [id, esEdicion]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validar que se haya seleccionado un laboratorio
      if (!formData.CodLab) {
        setError("Debe seleccionar un laboratorio");
        return;
      }
      
      // Preparar los datos para enviar
      const ordenData = {
        ...formData,
        Total: parseFloat(formData.Total) || 0,
        CodLab: parseInt(formData.CodLab)
      };
      
      if (esEdicion) {
        await ServicioFarmacia.actualizarOrdenCompra(id, ordenData);
      } else {
        await ServicioFarmacia.crearOrdenCompra(ordenData);
      }
      
      setExito(true);
      setError(null);
      
      // Redireccionar después de crear/editar
      setTimeout(() => {
        navigate('/ordenes-compra');
      }, 1500);
      
    } catch (err) {
      console.error("Error al guardar la orden:", err);
      setError("No se pudo guardar la orden de compra. Verifique los datos e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && esEdicion) return <div className="loading">Cargando datos de la orden...</div>;
  
  return (
    <div className="formulario-container">
      <h2>{esEdicion ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}</h2>
      
      {error && <div className="error">{error}</div>}
      {exito && <div className="exito">La orden se ha guardado correctamente.</div>}
      
      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo-form">
          <label htmlFor="fechaEmision">Fecha de Emisión:</label>
          <input
            type="date"
            id="fechaEmision"
            name="fechaEmision"
            value={formData.fechaEmision}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="campo-form">
          <label htmlFor="CodLab">Laboratorio:</label>
          <select
            id="CodLab"
            name="CodLab"
            value={formData.CodLab}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un laboratorio</option>
            {laboratorios.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.nombre}
              </option>
            ))}
          </select>
        </div>
        
        <div className="campo-form">
          <label htmlFor="NrofacturaProv">Nro. Factura Proveedor:</label>
          <input
            type="text"
            id="NrofacturaProv"
            name="NrofacturaProv"
            value={formData.NrofacturaProv}
            onChange={handleChange}
            placeholder="Número de factura del proveedor"
          />
        </div>
        
        <div className="campo-form">
          <label htmlFor="Situacion">Situación:</label>
          <select
            id="Situacion"
            name="Situacion"
            value={formData.Situacion}
            onChange={handleChange}
            required
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
            <option value="Entregada">Entregada</option>
          </select>
        </div>
        
        {esEdicion && (
          <div className="campo-form">
            <label htmlFor="Total">Total:</label>
            <input
              type="number"
              id="Total"
              name="Total"
              value={formData.Total}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="Total de la orden"
            />
          </div>
        )}
        
        <div className="acciones-form">
          <button type="button" onClick={() => navigate('/ordenes-compra')} className="btn-cancelar">
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

export default FormularioOrden;
