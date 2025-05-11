import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Registro from './components/registro';
import Dashboard from './components/Dashboard';
import BarraNavegacion from './components/BarraNavegacion';
import ListaMedicamentos from './components/medicamentos/ListaMedicamentos';
import FormularioMedicamento from './components/medicamentos/FormularioMedicamento';
import ListaLaboratorios from './components/laboratorios/ListaLaboratorios';
import FormularioLaboratorio from './components/laboratorios/FormularioLaboratorio';
import ListaOrdenes from './components/ordenes/ListaOrdenes';
import DetalleOrden from './components/ordenes/DetalleOrden';
import FormularioOrden from './components/ordenes/FormularioOrden';
import AgregarMedicamentoOrden from './components/ordenes/AgregarMedicamentoOrden';
import ListaUsuarios from './components/usuarios/ListaUsuarios';
import FormularioUsuario from './components/usuarios/FormularioUsuario';
import ActividadReciente from './components/actividades/ActividadReciente';
import ServicioAutenticacion from './services/auth.service';
import { NotificacionContextProvider } from './components/notificaciones/Notificacion';
import './App.css';

// Componente para rutas protegidas
const RutaProtegida = ({ children }) => {
  return ServicioAutenticacion.estaAutenticado() ? children : <Navigate to="/login" />;
};

// Componente para rutas de administrador
const RutaAdmin = ({ children }) => {
  const usuario = ServicioAutenticacion.obtenerUsuarioActual();
  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');
  
  return ServicioAutenticacion.estaAutenticado() && esAdmin ? 
    children : 
    <Navigate to="/dashboard" />;
};

// Componente para rutas de moderador o administrador
const RutaModeradorOAdmin = ({ children }) => {
  const usuario = ServicioAutenticacion.obtenerUsuarioActual();
  const esAdmin = usuario?.roles?.includes('ROLE_ADMIN');
  const esModerador = usuario?.roles?.includes('ROLE_MODERATOR');
  
  return ServicioAutenticacion.estaAutenticado() && (esAdmin || esModerador) ? 
    children : 
    <Navigate to="/dashboard" />;
};

function App() {
  return (
    <NotificacionContextProvider>
      <div className="app-container">
        <BarraNavegacion />
        <div className="contenido-principal">
          <Routes>
            {/* Rutas públicas */}          <Route path="/login" element={
            ServicioAutenticacion.estaAutenticado() ? 
              <Navigate to="/dashboard" /> : 
              <Login />
          } />
          
          {/* Ruta de registro */}
          <Route path="/registro" element={
            ServicioAutenticacion.estaAutenticado() ? 
              <Navigate to="/dashboard" /> : 
              <Registro />
          } />
          
          {/* Redirección a dashboard o login */}
            <Route path="/" element={
              <Navigate to={ServicioAutenticacion.estaAutenticado() ? "/dashboard" : "/login"} />
            } />
            
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            } />
            
            {/* Rutas de medicamentos */}
            <Route path="/medicamentos" element={
              <RutaProtegida>
                <ListaMedicamentos />
              </RutaProtegida>
            } />
            <Route path="/medicamentos/nuevo" element={
              <RutaAdmin>
                <FormularioMedicamento />
              </RutaAdmin>
            } />
            <Route path="/medicamentos/editar/:id" element={
              <RutaAdmin>
                <FormularioMedicamento />
              </RutaAdmin>
            } />
            
            {/* Rutas de laboratorios */}
            <Route path="/laboratorios" element={
              <RutaProtegida>
                <ListaLaboratorios />
              </RutaProtegida>
            } />
            <Route path="/laboratorios/nuevo" element={
              <RutaAdmin>
                <FormularioLaboratorio />
              </RutaAdmin>
            } />
            <Route path="/laboratorios/editar/:id" element={
              <RutaAdmin>
                <FormularioLaboratorio />
              </RutaAdmin>
            } />
            
            {/* Rutas de órdenes de compra */}
            <Route path="/ordenes-compra" element={
              <RutaProtegida>
                <ListaOrdenes />
              </RutaProtegida>
            } />
            <Route path="/ordenes-compra/nueva" element={
              <RutaAdmin>
                <FormularioOrden />
              </RutaAdmin>
            } />
            <Route path="/ordenes-compra/editar/:id" element={
              <RutaAdmin>
                <FormularioOrden />
              </RutaAdmin>
            } />
            <Route path="/ordenes-compra/:id" element={
              <RutaProtegida>
                <DetalleOrden />
              </RutaProtegida>
            } />
            <Route path="/ordenes-compra/:id/agregar-medicamento" element={
              <RutaAdmin>
                <AgregarMedicamentoOrden />
              </RutaAdmin>
            } />
            
            {/* Rutas de usuarios */}
            <Route path="/usuarios" element={
              <RutaAdmin>
                <ListaUsuarios />
              </RutaAdmin>
            } />
            <Route path="/usuarios/nuevo" element={
              <RutaAdmin>
                <FormularioUsuario />
              </RutaAdmin>
            } />
            <Route path="/usuarios/editar/:id" element={
              <RutaAdmin>
                <FormularioUsuario />
              </RutaAdmin>
            } />
            
            {/* Ruta de actividades recientes */}
            <Route path="/actividades" element={
              <RutaModeradorOAdmin>
                <ActividadReciente />
              </RutaModeradorOAdmin>
            } />
            
            {/* Ruta por defecto - 404 */}
            <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
          </Routes>
        </div>
      </div>
    </NotificacionContextProvider>
  );
}

export default App;


