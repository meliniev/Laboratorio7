import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ServicioAutenticacion from '../services/auth.service';
import { NotificacionProvider } from './notificaciones/Notificacion';
import './registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const { exito, error: mostrarError } = useContext(NotificacionProvider);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Validación de formulario
  const validarFormulario = () => {
    const newErrors = {};
    
    // Validar username
    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    } else if (formData.username.length > 20) {
      newErrors.username = 'El nombre de usuario no puede tener más de 20 caracteres';
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    
    // Si no hay errores, retornar true
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!validarFormulario()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // Enviar datos al servidor
      await ServicioAutenticacion.registrar(
        formData.username,
        formData.email,
        formData.password
      );
      
      // Mostrar mensaje de éxito
      exito('Registro exitoso. Ahora puedes iniciar sesión', 3000);
      
      // Redirigir al login
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      let errorMsg = 'Error al registrar usuario';
      
      if (err.response && err.response.data) {
        errorMsg = err.response.data.message || errorMsg;
      }
      
      setMessage(errorMsg);
      mostrarError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="registro-container mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="registro-card">
            <h2 className="text-center mb-4">Crear Cuenta</h2>
            
            {message && (
              <Alert variant="danger" className="mt-3">{message}</Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                  placeholder="Ingresa tu nombre de usuario"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Ingresa tu correo electrónico"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Ingresa tu contraseña"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  placeholder="Confirma tu contraseña"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mt-3" 
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </Form>
            
            <div className="text-center mt-3">
              ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;
