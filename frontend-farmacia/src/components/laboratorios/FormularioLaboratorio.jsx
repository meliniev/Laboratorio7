import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServicioFarmacia from '../../services/farmacia.service';
import './Laboratorios.css';

const FormularioLaboratorio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;
    const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    contacto: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Si es edición, cargar datos del laboratorio
    if (esEdicion) {
      const cargarLaboratorio = async () => {
        try {
          setLoading(true);
          const response = await ServicioFarmacia.obtenerLaboratorioPorId(id);
          const laboratorio = response.data;          setFormData({
            nombre: laboratorio.nombre,
            direccion: laboratorio.direccion || '',
            telefono: laboratorio.telefono || '',
            email: laboratorio.email || '',
            contacto: laboratorio.contacto || ''
          });
          setError(null);
        } catch (err) {
          console.error("Error al cargar laboratorio:", err);
          setError("No se pudo cargar la información del laboratorio.");
        } finally {
          setLoading(false);
        }
      };
      
      cargarLaboratorio();
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
    
    try {
      // Validar datos
      if (!formData.nombre) {
        setError("El nombre del laboratorio es obligatorio.");
        setLoading(false);
        return;
      }
      
      // Guardar datos
      if (esEdicion) {
        await ServicioFarmacia.actualizarLaboratorio(id, formData);
      } else {
        await ServicioFarmacia.crearLaboratorio(formData);
      }
      
      // Redirigir a la lista
      navigate('/laboratorios');
    } catch (err) {
      console.error("Error al guardar laboratorio:", err);
      setError("No se pudo guardar el laboratorio. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && esEdicion) return <div className="loading">Cargando datos...</div>;
  
  return (
    <div className="formulario-container">
      <h2>{esEdicion ? 'Editar Laboratorio' : 'Nuevo Laboratorio'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="formulario">
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
          <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contacto">Contacto</label>
          <input
            type="text"
            id="contacto"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/laboratorios')} className="btn-cancelar">
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

export default FormularioLaboratorio;
