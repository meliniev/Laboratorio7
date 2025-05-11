import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicioAutenticacion from '../services/auth.service';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const response = await ServicioAutenticacion.iniciarSesion(username, password);
      setSuccess(true);
      setMessage('Inicio de sesión exitoso. Redirigiendo...');
      console.log('Respuesta de la API:', response);
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);} catch (err) {
      setSuccess(false);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      {message && (
        <div className={success ? "success-message" : "error-message"}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;
