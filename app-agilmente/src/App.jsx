// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import Cronograma from './pages/Cronograma';
import PainelOrganizador from './pages/PainelOrganizador';
import ControlePresenca from './pages/ControlePresenca';

export default function App() {
  return (
    <div style={{ backgroundColor: '#f0f2f5', color: 'black', minHeight: '100vh' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/painel" element={<PainelOrganizador />} />
          <Route path="/presenca" element={<ControlePresenca />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}