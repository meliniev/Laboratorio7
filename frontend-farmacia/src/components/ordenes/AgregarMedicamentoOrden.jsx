import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ServicioFarmacia from '../../services/farmacia.service';
import { NotificacionProvider } from '../notificaciones/Notificacion';
import './Ordenes.css';

const AgregarMedicamentoOrden = () => {  const { id } = useParams();
  const navigate = useNavigate();
  const { exito: mostrarExito, error: mostrarError, advertencia: mostrarAdvertencia } = useContext(NotificacionProvider);
  
  const [formData, setFormData] = useState({
    CodMedicamento: '',
    descripcion: '',
    cantidad: '1',
    precio: '0.00',
    montouni: '0.00'
  });  const [orden, setOrden] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
            // Cargar la orden para asegurarnos que existe
        const responseOrden = await ServicioFarmacia.obtenerOrdenCompraPorId(id);
        setOrden(responseOrden.data);
        
        // Cargar medicamentos disponibles
        const responseMedicamentos = await ServicioFarmacia.obtenerMedicamentos();
        setMedicamentos(responseMedicamentos.data);
        
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos necesarios. Verifique su conexión.");
        mostrarError("No se pudieron cargar los datos necesarios", 3000);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [id]);
  
  // Actualizar el precio y descripción cuando cambia el medicamento seleccionado
  const handleMedicamentoChange = (e) => {
    const codMed = e.target.value;
    setFormData({
      ...formData,
      CodMedicamento: codMed
    });
    
    if (codMed) {
      const med = medicamentos.find(m => m.CodMedicamento.toString() === codMed);
      if (med) {
        setMedicamentoSeleccionado(med);
        setFormData(prev => ({
          ...prev,
          CodMedicamento: codMed,
          descripcion: med.descripcionMed || '',
          precio: med.precio ? med.precio.toString() : '0.00',
          montouni: med.precio ? med.precio.toString() : '0.00'
        }));
      }
    } else {
      setMedicamentoSeleccionado(null);
    }
  };
  
  // Actualizar montouni cuando cambia cantidad o precio
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };
      
      // Recalcular monto unitario si cambia cantidad o precio
      if (name === 'cantidad' || name === 'precio') {
        const cantidad = parseFloat(newFormData.cantidad) || 0;
        const precio = parseFloat(newFormData.precio) || 0;
        newFormData.montouni = (cantidad * precio).toFixed(2);
      }
      
      return newFormData;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
      // Validar que se haya seleccionado un medicamento
    if (!formData.CodMedicamento) {
      setError("Debe seleccionar un medicamento");
      mostrarError("Debe seleccionar un medicamento", 3000);
      return;
    }
      try {
      setLoading(true);
      mostrarAdvertencia("Agregando medicamento a la orden...", 1000);
      
      // Preparar datos para enviar
      const detalleData = {
        NroOrdenC: parseInt(id),
        CodMedicamento: parseInt(formData.CodMedicamento),
        descripcion: formData.descripcion,
        cantidad: parseInt(formData.cantidad),
        precio: parseFloat(formData.precio),
        montouni: parseFloat(formData.montouni)
      };
      
      // Crear detalle de orden
      await ServicioFarmacia.crearDetalleOrden(detalleData);
      
      // Actualizar el total de la orden
      const responseOrden = await ServicioFarmacia.obtenerOrdenCompraPorId(id);
      const ordenActual = responseOrden.data;
      
      // Calcular nuevo total agregando el monto de este nuevo detalle
      const nuevoTotal = (parseFloat(ordenActual.Total || 0) + parseFloat(detalleData.montouni)).toFixed(2);
      
      // Actualizar la orden con el nuevo total
      await ServicioFarmacia.actualizarOrdenCompra(id, {
        ...ordenActual,        Total: nuevoTotal
      });
      
      setError(null);
      mostrarExito("Medicamento agregado a la orden con éxito", 2000);
      
      // Redireccionar al detalle de la orden
      setTimeout(() => {
        navigate(`/ordenes-compra/${id}`);
      }, 1000);
        } catch (err) {
      console.error("Error al agregar medicamento:", err);
      setError("No se pudo agregar el medicamento a la orden. Verifique los datos e intente nuevamente.");
      mostrarError("No se pudo agregar el medicamento a la orden", 3000);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !medicamentos.length) {
    return <div className="loading">Cargando datos...</div>;
  }
  
  if (!orden) {
    return <div className="error">No se encontró la orden de compra especificada.</div>;
  }
  
  return (
    <div className="formulario-container">      <h2>Agregar Medicamento a Orden #{id}</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo-form">
          <label htmlFor="CodMedicamento">Medicamento:</label>
          <select
            id="CodMedicamento"
            name="CodMedicamento"
            value={formData.CodMedicamento}
            onChange={handleMedicamentoChange}
            required
          >
            <option value="">Seleccione un medicamento</option>
            {medicamentos.map((med) => (
              <option key={med.CodMedicamento} value={med.CodMedicamento}>
                {med.descripcionMed} - {med.presentacionMed}
              </option>
            ))}
          </select>
        </div>
        
        <div className="campo-form">
          <label htmlFor="descripcion">Descripción:</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del medicamento"
          />
        </div>
        
        <div className="campo-form">
          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div className="campo-form">
          <label htmlFor="precio">Precio Unitario ($):</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="campo-form">
          <label htmlFor="montouni">Monto Total ($):</label>
          <input
            type="number"
            id="montouni"
            name="montouni"
            value={formData.montouni}
            readOnly
            className="campo-solo-lectura"
          />
        </div>
        
        <div className="acciones-form">
          <button 
            type="button" 
            onClick={() => navigate(`/ordenes-compra/${id}`)} 
            className="btn-cancelar"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-guardar" 
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Agregar Medicamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarMedicamentoOrden;
