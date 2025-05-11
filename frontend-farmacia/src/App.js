import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import BarraNavegacion from './components/BarraNavegacion';
import ListaMedicamentos from './components/medicamentos/ListaMedicamentos';
import FormularioMedicamento from './components/medicamentos/FormularioMedicamento';
import ListaLaboratorios from './components/laboratorios/ListaLaboratorios';
import FormularioLaboratorio from './components/laboratorios/FormularioLaboratorio';
import ListaOrdenes from './components/ordenes/ListaOrdenes';
import DetalleOrden from './components/ordenes/DetalleOrden';
import ServicioAutenticacion from './services/auth.service';
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

function App() {
  return (
    <div className="app-container">
      <BarraNavegacion />
      <div className="contenido-principal">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={
            ServicioAutenticacion.estaAutenticado() ? 
              <Navigate to="/dashboard" /> : 
              <Login />
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
          <Route path="/ordenes-compra/:id" element={
            <RutaProtegida>
              <DetalleOrden />
            </RutaProtegida>
          } />
          
          {/* Ruta por defecto - 404 */}
          <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;


