import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge, Alert, Pagination } from 'react-bootstrap';
import ServicioActividades from '../../services/actividad.service';
import ServicioAutenticacion from '../../services/auth.service';
import './ActividadReciente.css';

const ActividadReciente = () => {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [paginacion, setPaginacion] = useState({
    total: 0,
    offset: 0,
    limit: 10
  });
  
  // Filtros
  const [filtros, setFiltros] = useState({
    tipo: '',
    entidad: '',
    usuarioId: ''
  });
  
  // Opciones para los filtros
  const tiposActividad = ServicioActividades.obtenerTiposActividad();
  const entidades = ServicioActividades.obtenerEntidades();
  
  // Verificar si el usuario actual tiene los permisos necesarios
  const usuario = ServicioAutenticacion.obtenerUsuarioActual();
  const tieneAcceso = usuario && usuario.roles && 
    (usuario.roles.includes('ROLE_ADMIN') || usuario.roles.includes('ROLE_MODERATOR'));
  
  useEffect(() => {
    if (!tieneAcceso) {
      setError('No tienes permisos para acceder a esta información');
      setCargando(false);
      return;
    }
    
    cargarActividades();
  }, [paginacion.offset, paginacion.limit]);
  
  const cargarActividades = () => {
    setCargando(true);
    setError(null);
    
    ServicioActividades.obtenerActividades({
      ...filtros,
      offset: paginacion.offset,
      limit: paginacion.limit
    })
      .then(data => {
        setActividades(data.actividades);
        setPaginacion({
          ...paginacion,
          total: data.paginacion.total
        });
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar actividades:', err);
        setError('Error al cargar las actividades: ' + (err.response?.data?.message || err.message));
        setCargando(false);
      });
  };
  
  const aplicarFiltros = (e) => {
    e.preventDefault();
    cargarActividades();
  };
  
  const limpiarFiltros = () => {
    setFiltros({
      tipo: '',
      entidad: '',
      usuarioId: ''
    });
    setTimeout(cargarActividades, 0);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };
  
  const handlePaginaAnterior = () => {
    if (paginacion.offset - paginacion.limit >= 0) {
      setPaginacion({
        ...paginacion,
        offset: paginacion.offset - paginacion.limit
      });
    }
  };
  
  const handlePaginaSiguiente = () => {
    if (paginacion.offset + paginacion.limit < paginacion.total) {
      setPaginacion({
        ...paginacion,
        offset: paginacion.offset + paginacion.limit
      });
    }
  };
  
  // Obtener el número de página actual (base 1)
  const paginaActual = Math.floor(paginacion.offset / paginacion.limit) + 1;
  const totalPaginas = Math.ceil(paginacion.total / paginacion.limit);
  
  // Función para formatear fechas
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };
  
  // Obtener color de badge según el tipo de actividad
  const obtenerColorBadge = (tipo) => {
    switch (tipo) {
      case 'login': return 'success';
      case 'logout': return 'info';
      case 'creacion': return 'primary';
      case 'modificacion': return 'warning';
      case 'eliminacion': return 'danger';
      default: return 'secondary';
    }
  };
  
  if (!tieneAcceso) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          No tienes permisos para acceder a esta sección. Esta funcionalidad está disponible solo para moderadores y administradores.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="actividad-reciente mt-4">
      <h2>Actividad Reciente</h2>
      
      {/* Filtros */}
      <Form onSubmit={aplicarFiltros} className="mb-4 filtros-actividad">
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Tipo de Actividad</Form.Label>
              <Form.Control
                as="select"
                name="tipo"
                value={filtros.tipo}
                onChange={handleInputChange}
              >
                <option value="">Todos</option>
                {tiposActividad.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group>
              <Form.Label>Entidad</Form.Label>
              <Form.Control
                as="select"
                name="entidad"
                value={filtros.entidad}
                onChange={handleInputChange}
              >
                <option value="">Todas</option>
                {entidades.map(entidad => (
                  <option key={entidad.value} value={entidad.value}>{entidad.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group>
              <Form.Label>ID Usuario</Form.Label>
              <Form.Control
                type="text"
                name="usuarioId"
                value={filtros.usuarioId}
                onChange={handleInputChange}
                placeholder="ID del usuario"
              />
            </Form.Group>
          </Col>
          
          <Col md={3} className="d-flex align-items-end">
            <Button variant="primary" type="submit" className="me-2">
              Filtrar
            </Button>
            <Button variant="secondary" onClick={limpiarFiltros}>
              Limpiar
            </Button>
          </Col>
        </Row>
      </Form>
      
      {/* Mensajes de error */}
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      {/* Tabla de actividades */}
      {cargando ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Entidad</th>
                <th>ID Entidad</th>
                <th>Usuario</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {actividades.length > 0 ? (
                actividades.map(actividad => (
                  <tr key={actividad.id}>
                    <td>{actividad.id}</td>
                    <td>
                      <Badge bg={obtenerColorBadge(actividad.tipoActividad)}>
                        {actividad.tipoActividad}
                      </Badge>
                    </td>
                    <td>{actividad.descripcion}</td>
                    <td>{actividad.entidad}</td>
                    <td>{actividad.idEntidad}</td>
                    <td>{actividad.user ? actividad.user.username : 'Sistema'}</td>
                    <td>{formatearFecha(actividad.fecha)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No hay actividades que mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          
          {/* Paginación */}
          {actividades.length > 0 && (
            <div className="d-flex justify-content-between align-items-center">
              <div>
                Mostrando {paginacion.offset + 1}-
                {Math.min(paginacion.offset + actividades.length, paginacion.total)} de {paginacion.total} registros
              </div>
              
              <Pagination>
                <Pagination.Prev
                  onClick={handlePaginaAnterior}
                  disabled={paginacion.offset === 0}
                />
                
                <Pagination.Item active>{paginaActual}</Pagination.Item>
                
                <Pagination.Next
                  onClick={handlePaginaSiguiente}
                  disabled={paginacion.offset + paginacion.limit >= paginacion.total}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ActividadReciente;
