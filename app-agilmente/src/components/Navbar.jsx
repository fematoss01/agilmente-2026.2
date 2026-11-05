import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Lê os dados do usuário atual (agora é um objeto em JSON)
  const usuarioStr = localStorage.getItem('usuarioLogado');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#1890ff', color: 'white', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ margin: 0 }}>Agilmente</h2>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {/* Links exclusivos do Aluno */}
        {usuario?.tipo === 'aluno' && (
          <>
            <Link to="/catalogo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Catálogo</Link>
            <Link to="/cronograma" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Meu Cronograma</Link>
          </>
        )}

        {/* Link exclusivo do Organizador */}
        {usuario?.tipo === 'organizador' && (
          <Link to="/painel" style={{ color: '#ffd700', textDecoration: 'none', fontWeight: 'bold' }}>Painel Gerencial</Link>
        )}

        {/* Identificação e Logout */}
        <span style={{ marginLeft: '10px', fontSize: '0.9rem', fontStyle: 'italic' }}>Olá, {usuario?.nome}</span>
        <button onClick={handleLogout} style={{ padding: '5px 15px', backgroundColor: 'transparent', border: '1px solid white', color: 'white', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}>
          Sair
        </button>
      </div>
    </nav>
  );
}