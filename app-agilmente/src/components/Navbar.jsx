import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa a sessão simulada e volta para o login
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#1890ff', color: 'white', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ margin: 0 }}>Agilmente</h2>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/catalogo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Catálogo</Link>
        {/* Este link preparará o terreno para a US01 */}
        <Link to="/cronograma" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Meu Cronograma</Link>
        <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: 'transparent', border: '1px solid white', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
      </div>
    </nav>
  );
}