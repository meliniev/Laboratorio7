import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ServicioAutenticacion from '../services/auth.service';
import { NotificacionProvider } from './notificaciones/Notificacion';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { exito, error: mostrarError } = useContext(NotificacionProvider);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {      
      const response = await ServicioAutenticacion.iniciarSesion(username, password);
      exito('Inicio de sesión exitoso', 2000);
      console.log('Respuesta de la API:', response);
      
      // Redirigir inmediatamente
      navigate('/dashboard');
    } catch (err) {
      console.error('Error completo:', err);
      
      let errorMsg = 'Error de comunicación con el servidor';
      
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Datos del error:', err.response.data);
        console.error('Estado HTTP:', err.response.status);
        errorMsg = err.response.data?.message || `Error del servidor: ${err.response.status}`;
      } else if (err.request) {
        // La petición fue realizada pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
        errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
      } else {
        // Error al configurar la petición
        console.error('Error al configurar la petición:', err.message);
        errorMsg = `Error de configuración: ${err.message}`;      
      }
      
      setMessage(errorMsg);
      mostrarError(errorMsg, 3000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="login-card">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            
            {message && (
              <Alert variant="danger" className="mt-3">
                {message}
              </Alert>
            )}
            
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu nombre de usuario"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mt-3" 
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Form>
            
            <div className="text-center mt-3">
              ¿No tienes una cuenta? <Link to="/registro">Registrarse</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
