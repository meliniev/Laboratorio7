import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL_FARMACIA || 'http://localhost:5000/api/farmacia/';

// Servicio para la comunicación con la API de farmacia

/**
 * SERVICIOS PARA MEDICAMENTOS
 */
const obtenerMedicamentos = () => {
  return axios.get(API_URL + 'medicamentos', { headers: authHeader() })
    .then(response => {
      // Los datos ya vienen en el formato correcto del backend
      return response;
    })
    .catch(error => {
      console.error("Error en obtenerMedicamentos:", error);
      throw error;
    });
};

const obtenerMedicamentoPorId = (id) => {
  return axios.get(API_URL + `medicamentos/${id}`, { headers: authHeader() })
    .then(response => {
      // Los datos ya vienen en el formato correcto del backend
      return response;
    })
    .catch(error => {
      console.error("Error en obtenerMedicamentoPorId:", error);
      throw error;
    });
};

const crearMedicamento = (medicamento) => {
  // Asegurarse de que los datos están en el formato que espera el backend
  const medicamentoData = {
    ...medicamento,
    // Convertir CodLab a número si es un string
    CodLab: medicamento.CodLab ? parseInt(medicamento.CodLab) : null
  };
  
  return axios.post(API_URL + 'medicamentos', medicamentoData, { headers: authHeader() })
    .catch(error => {
      console.error("Error en crearMedicamento:", error);
      throw error;
    });
};

const actualizarMedicamento = (id, medicamento) => {
  // Asegurarse de que los datos están en el formato que espera el backend
  const medicamentoData = {
    ...medicamento,
    // Convertir CodLab a número si es un string
    CodLab: medicamento.CodLab ? parseInt(medicamento.CodLab) : null
  };
  
  return axios.put(API_URL + `medicamentos/${id}`, medicamentoData, { headers: authHeader() })
    .catch(error => {
      console.error("Error en actualizarMedicamento:", error);
      throw error;
    });
};

const eliminarMedicamento = (id) => {
  return axios.delete(API_URL + `medicamentos/${id}`, { headers: authHeader() });
};

/**
 * SERVICIOS PARA LABORATORIOS
 */
const obtenerLaboratorios = () => {
  return axios.get(API_URL + 'laboratorios', { headers: authHeader() })
    .then(response => {
      // Transformar nombres de campos para el frontend
      const labsTransformados = response.data.map(lab => ({
        id: lab.CodLab,
        nombre: lab.razonSocial,
        direccion: lab.direccion,
        telefono: lab.telefono,
        email: lab.email,
        contacto: lab.contacto
      }));
      return { ...response, data: labsTransformados };
    });
};

const obtenerLaboratorioPorId = (id) => {
  return axios.get(API_URL + `laboratorios/${id}`, { headers: authHeader() })
    .then(response => {
      // Transformar nombres de campos para el frontend
      const labTransformado = {
        id: response.data.CodLab,
        nombre: response.data.razonSocial,
        direccion: response.data.direccion,
        telefono: response.data.telefono,
        email: response.data.email,
        contacto: response.data.contacto
      };
      return { ...response, data: labTransformado };
    });
};

const crearLaboratorio = (laboratorio) => {
  // Transformar datos del frontend al formato del backend
  const labParaBackend = {
    razonSocial: laboratorio.nombre,
    direccion: laboratorio.direccion,
    telefono: laboratorio.telefono,
    email: laboratorio.email,
    contacto: laboratorio.contacto || ''
  };
  return axios.post(API_URL + 'laboratorios', labParaBackend, { headers: authHeader() });
};

const actualizarLaboratorio = (id, laboratorio) => {
  // Transformar datos del frontend al formato del backend
  const labParaBackend = {
    razonSocial: laboratorio.nombre,
    direccion: laboratorio.direccion,
    telefono: laboratorio.telefono,
    email: laboratorio.email,
    contacto: laboratorio.contacto || ''
  };
  return axios.put(API_URL + `laboratorios/${id}`, labParaBackend, { headers: authHeader() });
};

const eliminarLaboratorio = (id) => {
  return axios.delete(API_URL + `laboratorios/${id}`, { headers: authHeader() });
};

/**
 * SERVICIOS PARA ÓRDENES DE COMPRA
 */
const obtenerOrdenesCompra = () => {
  return axios.get(API_URL + 'ordenes-compra', { headers: authHeader() })
    .then(response => {
      // Dejamos los datos tal como vienen del backend para mantener coherencia con el modelo
      return response;
    })
    .catch(error => {
      console.error("Error en obtenerOrdenesCompra:", error);
      throw error;
    });
};

const obtenerOrdenCompraPorId = (id) => {
  return axios.get(API_URL + `ordenes-compra/${id}`, { headers: authHeader() })
    .then(response => {
      // Dejamos los datos tal como vienen del backend para mantener coherencia con el modelo
      return response;
    })
    .catch(error => {
      console.error("Error en obtenerOrdenCompraPorId:", error);
      throw error;
    });
};

const crearOrdenCompra = (orden) => {
  // Preparamos los datos para el backend
  const ordenData = {
    fechaEmision: orden.fechaEmision || new Date(),
    Situacion: orden.Situacion || 'Pendiente',
    Total: parseFloat(orden.Total || 0),
    NrofacturaProv: orden.NrofacturaProv || '',
    CodLab: parseInt(orden.CodLab)
  };
  
  return axios.post(API_URL + 'ordenes-compra', ordenData, { headers: authHeader() })
    .catch(error => {
      console.error("Error en crearOrdenCompra:", error);
      throw error;
    });
};

const actualizarOrdenCompra = (id, orden) => {
  // Preparamos los datos para el backend
  const ordenData = {
    fechaEmision: orden.fechaEmision,
    Situacion: orden.Situacion,
    Total: parseFloat(orden.Total || 0),
    NrofacturaProv: orden.NrofacturaProv || '',
    CodLab: parseInt(orden.CodLab)
  };
  
  return axios.put(API_URL + `ordenes-compra/${id}`, ordenData, { headers: authHeader() })
    .catch(error => {
      console.error("Error en actualizarOrdenCompra:", error);
      throw error;
    });
};

const eliminarOrdenCompra = (id) => {
  return axios.delete(API_URL + `ordenes-compra/${id}`, { headers: authHeader() });
};

/**
 * SERVICIOS PARA DETALLES DE ORDEN DE COMPRA
 */
const obtenerDetallesOrden = () => {
  return axios.get(API_URL + 'detalles-orden', { headers: authHeader() });
};

const obtenerDetallePorIds = (ordenId, medicamentoId) => {
  return axios.get(API_URL + `detalles-orden/${ordenId}/${medicamentoId}`, { headers: authHeader() });
};

const crearDetalleOrden = (detalle) => {
  return axios.post(API_URL + 'detalles-orden', detalle, { headers: authHeader() });
};

const actualizarDetalleOrden = (ordenId, medicamentoId, detalle) => {
  return axios.put(API_URL + `detalles-orden/${ordenId}/${medicamentoId}`, detalle, { headers: authHeader() });
};

const eliminarDetalleOrden = (ordenId, medicamentoId) => {
  return axios.delete(API_URL + `detalles-orden/${ordenId}/${medicamentoId}`, { headers: authHeader() });
};

const ServicioFarmacia = {
  // Medicamentos
  obtenerMedicamentos,
  obtenerMedicamentoPorId,
  crearMedicamento,
  actualizarMedicamento,
  eliminarMedicamento,
  
  // Laboratorios
  obtenerLaboratorios,
  obtenerLaboratorioPorId,
  crearLaboratorio,
  actualizarLaboratorio,
  eliminarLaboratorio,
  
  // Órdenes de compra
  obtenerOrdenesCompra,
  obtenerOrdenCompraPorId,
  crearOrdenCompra,
  actualizarOrdenCompra,
  eliminarOrdenCompra,
  
  // Detalles de orden
  obtenerDetallesOrden,
  obtenerDetallePorIds,
  crearDetalleOrden,
  actualizarDetalleOrden,
  eliminarDetalleOrden
};

export default ServicioFarmacia;
