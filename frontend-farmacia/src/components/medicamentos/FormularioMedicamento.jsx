import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServicioFarmacia from '../../services/farmacia.service';
import './Medicamentos.css';

const FormularioMedicamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;
  
  const [laboratorios, setLaboratorios] = useState([]);  const [formData, setFormData] = useState({
    descripcionMed: '',
    fechaFabricacion: '',
    fechaVencimiento: '',
    Presentacion: '',
    stock: '',
    precioVentaUni: '',
    precioVentaPres: '',
    Marca: '',
    CodLab: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Cargar los laboratorios para el select
    const cargarLaboratorios = async () => {
      try {
        const response = await ServicioFarmacia.obtenerLaboratorios();
        setLaboratorios(response.data);
      } catch (err) {
        console.error("Error al cargar laboratorios:", err);
        setError("No se pudieron cargar los laboratorios.");
      }
    };
    
    cargarLaboratorios();
    
    // Si es edición, cargar datos del medicamento
    if (esEdicion) {
      const cargarMedicamento = async () => {
        try {
          setLoading(true);
          const response = await ServicioFarmacia.obtenerMedicamentoPorId(id);          const medicamento = response.data;
          setFormData({
            descripcionMed: medicamento.descripcionMed || '',
            fechaFabricacion: medicamento.fechaFabricacion ? new Date(medicamento.fechaFabricacion).toISOString().split('T')[0] : '',
            fechaVencimiento: medicamento.fechaVencimiento ? new Date(medicamento.fechaVencimiento).toISOString().split('T')[0] : '',
            Presentacion: medicamento.Presentacion || '',
            stock: medicamento.stock || '',
            precioVentaUni: medicamento.precioVentaUni || '',
            precioVentaPres: medicamento.precioVentaPres || '',
            Marca: medicamento.Marca || '',
            CodLab: medicamento.CodLab || medicamento.Laboratorio?.CodLab || ''
          });
          setError(null);
        } catch (err) {
          console.error("Error al cargar medicamento:", err);
          setError("No se pudo cargar la información del medicamento.");
        } finally {
          setLoading(false);
        }
      };
      
      cargarMedicamento();
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
    setLoading(true);
    setError(null);
    
    try {      // Validar datos
      if (!formData.descripcionMed || !formData.stock || !formData.CodLab) {
        setError("Por favor, completa todos los campos obligatorios.");
        setLoading(false);
        return;
      }
      
      // Preparar datos
      const medicamentoData = {
        ...formData,
        stock: parseInt(formData.stock, 10),
        precioVentaUni: parseFloat(formData.precioVentaUni),
        precioVentaPres: parseFloat(formData.precioVentaPres),
        CodLab: parseInt(formData.CodLab)
      };
      
      // Guardar datos
      if (esEdicion) {
        await ServicioFarmacia.actualizarMedicamento(id, medicamentoData);
      } else {
        await ServicioFarmacia.crearMedicamento(medicamentoData);
      }
      
      // Redirigir a la lista
      navigate('/medicamentos');
    } catch (err) {
      console.error("Error al guardar medicamento:", err);
      setError("No se pudo guardar el medicamento. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && esEdicion) return <div className="loading">Cargando datos...</div>;
  
  return (
    <div className="formulario-container">
      <h2>{esEdicion ? 'Editar Medicamento' : 'Nuevo Medicamento'}</h2>
      
      {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="formulario">
        <div className="form-group">
          <label htmlFor="descripcionMed">Descripción *</label>
          <input
            type="text"
            id="descripcionMed"
            name="descripcionMed"
            value={formData.descripcionMed}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fechaFabricacion">Fecha de Fabricación</label>
          <input
            type="date"
            id="fechaFabricacion"
            name="fechaFabricacion"
            value={formData.fechaFabricacion}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fechaVencimiento">Fecha de Vencimiento</label>
          <input
            type="date"
            id="fechaVencimiento"
            name="fechaVencimiento"
            value={formData.fechaVencimiento}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="Presentacion">Presentación</label>
          <input
            type="text"
            id="Presentacion"
            name="Presentacion"
            value={formData.Presentacion}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="stock">Stock *</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="precioVentaUni">Precio Unitario *</label>
          <input
            type="number"
            id="precioVentaUni"
            name="precioVentaUni"
            value={formData.precioVentaUni}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="precioVentaPres">Precio por Presentación</label>
          <input
            type="number"
            id="precioVentaPres"
            name="precioVentaPres"
            value={formData.precioVentaPres}
            onChange={handleChange}
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="Marca">Marca</label>
          <input
            type="text"
            id="Marca"
            name="Marca"
            value={formData.Marca}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="CodLab">Laboratorio *</label>
          <select
            id="CodLab"
            name="CodLab"
            value={formData.CodLab}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un laboratorio</option>
            {laboratorios.map((lab) => (
              <option key={lab.id} value={lab.id}>{lab.nombre}</option>
            ))}
          </select>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/medicamentos')} className="btn-cancelar">
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

export default FormularioMedicamento;
