import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import Cronograma from './pages/Cronograma';

export default function App() {
  return (
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh', width: '100vw' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/cronograma" element={<Cronograma />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}