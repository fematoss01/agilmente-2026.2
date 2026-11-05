import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [ra, setRa] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuariosDb')) || [];

    if (isLogin) {
      if (email === 'admin@agilmente.com' && senha === 'admin') {
        localStorage.setItem('usuarioLogado', JSON.stringify({ tipo: 'organizador', nome: 'Administrador' }));
        navigate('/painel');
        return;
      }

      const alunoEncontrado = usuariosSalvos.find(u => u.email === email && u.senha === senha);
      
      if (alunoEncontrado) {
        localStorage.setItem('usuarioLogado', JSON.stringify({ 
          tipo: 'aluno', nome: alunoEncontrado.nome, email: alunoEncontrado.email, ra: alunoEncontrado.ra
        }));
        navigate('/catalogo');
      } else {
        alert('E-mail ou senha incorretos!');
      }
    } else {
      const emailJaExiste = usuariosSalvos.find(u => u.email === email);
      const raJaExiste = usuariosSalvos.find(u => u.ra === ra); // Verifica RA duplicado

      if (emailJaExiste) {
        alert('Este e-mail já está cadastrado!');
        return;
      }
      if (raJaExiste) {
        alert('Este RA já está em uso por outro aluno!');
        return;
      }

      const novoUsuario = { nome, email, ra, senha, tipo: 'aluno' };
      usuariosSalvos.push(novoUsuario);
      localStorage.setItem('usuariosDb', JSON.stringify(usuariosSalvos));

      alert('Cadastro realizado com sucesso! Faça login para entrar.');
      setIsLogin(true);
      setSenha('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '80px', fontFamily: 'sans-serif' }}>
      <h1>Agilmente</h1>
      <p>{isLogin ? 'Faça login para acessar a Semana Acadêmica' : 'Crie sua conta de Aluno'}</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        {!isLogin && (
          <>
            <input type="text" placeholder="Nome Completo" required value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="RA (Registro Acadêmico)" required value={ra} onChange={(e) => setRa(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </>
        )}
        <input type="email" placeholder="E-mail Institucional" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="Senha" required value={senha} onChange={(e) => setSenha(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
      <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}>
        {isLogin ? 'Não tem uma conta? Cadastre-se aqui' : 'Já tem uma conta? Faça login'}
      </button>
    </div>
  );
}