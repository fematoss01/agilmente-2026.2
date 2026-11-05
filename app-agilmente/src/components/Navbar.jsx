import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LayoutDashboard, ClipboardList, LogOut, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const usuarioStr = localStorage.getItem('usuarioLogado');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', padding: '15px 40px', 
      backgroundColor: '#ffffff', color: '#333', alignItems: 'center', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1890ff' }}>
        <GraduationCap size={32} />
        <h2 style={{ margin: 0, fontSize: '24px', letterSpacing: '-0.5px' }}>Agilmente</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        {/* Renderiza EXCLUSIVAMENTE para ALUNOS */}
        {usuario && usuario.tipo === 'aluno' && (
          <>
            <Link to="/catalogo" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', textDecoration: 'none', fontWeight: '500' }}>
              <LayoutDashboard size={18} /> Catálogo
            </Link>
            <Link to="/cronograma" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', textDecoration: 'none', fontWeight: '500' }}>
              <Calendar size={18} /> Meu Cronograma
            </Link>
          </>
        )}

        {/* Renderiza EXCLUSIVAMENTE para ORGANIZADORES */}
        {usuario && usuario.tipo === 'organizador' && (
          <>
            <Link to="/painel" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1890ff', textDecoration: 'none', fontWeight: '600' }}>
              <LayoutDashboard size={18} /> Painel Gerencial
            </Link>
            <Link to="/presenca" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#52c41a', textDecoration: 'none', fontWeight: '600' }}>
              <ClipboardList size={18} /> Chamada
            </Link>
          </>
        )}

        <div style={{ borderLeft: '1px solid #eee', height: '30px', margin: '0 10px' }}></div>

        <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: '500' }}>
          Olá, <strong style={{ color: '#333' }}>{usuario?.nome?.split(' ')[0]}</strong>
        </span>
        <button 
          onClick={handleLogout} 
          className="btn-animado"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', 
            backgroundColor: '#fff1f0', border: '1px solid #ffa39e', color: '#cf1322', 
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
          }}
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </nav>
  );
}