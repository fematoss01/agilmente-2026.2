import { useState, useEffect } from 'react';
import { dbInicial } from '../data/db';
import Navbar from '../components/Navbar';

const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const partes = dataStr.split('-');
  if (partes.length !== 3) return dataStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

export default function ControlePresenca() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState('');
  const [presencasGlobais, setPresencasGlobais] = useState({});

  useEffect(() => {
    const eventosSalvos = localStorage.getItem('eventosData');
    setEventos(eventosSalvos ? JSON.parse(eventosSalvos) : dbInicial.eventos);
    
    const presencasSalvas = JSON.parse(localStorage.getItem('presencasGlobais')) || {};
    setPresencasGlobais(presencasSalvas);
  }, []);

  const registrarPresenca = (email, status) => {
    if (!eventoSelecionadoId) return;
    
    const novasPresencas = {
      ...presencasGlobais,
      [eventoSelecionadoId]: {
        ...(presencasGlobais[eventoSelecionadoId] || {}),
        [email]: status
      }
    };
    
    setPresencasGlobais(novasPresencas);
    localStorage.setItem('presencasGlobais', JSON.stringify(novasPresencas));
  };

  const eventoAtual = eventos.find(e => e.id.toString() === eventoSelecionadoId);
  const listaInscritos = eventoAtual?.inscritos || [];
  const presencasDoEvento = presencasGlobais[eventoSelecionadoId] || {};

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>Controle de Presença</h1>
        <p>Selecione um evento para realizar a chamada dos alunos inscritos.</p>
        
        <div style={{ marginBottom: '20px', backgroundColor: '#f0f2f5', padding: '15px', borderRadius: '8px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Evento: </label>
          <select value={eventoSelecionadoId} onChange={e => setEventoSelecionadoId(e.target.value)} style={{ padding: '8px', minWidth: '300px' }}>
            <option value="">-- Escolha um evento --</option>
            {eventos.map(e => (
              <option key={e.id} value={e.id}>{e.titulo} ({formatarData(e.data)})</option>
            ))}
          </select>
        </div>

        {eventoSelecionadoId && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ccc' }}>RA</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ccc' }}>Nome</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ccc' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {listaInscritos.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center' }}>Nenhum aluno inscrito neste evento.</td></tr>
                ) : (
                  listaInscritos.map((aluno, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{aluno.ra}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{aluno.nome}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        <button 
                          onClick={() => registrarPresenca(aluno.email, 'presente')} 
                          style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: presencasDoEvento[aluno.email] === 'presente' ? '#52c41a' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Presente
                        </button>
                        <button 
                          onClick={() => registrarPresenca(aluno.email, 'falta')} 
                          style={{ padding: '6px 12px', backgroundColor: presencasDoEvento[aluno.email] === 'falta' ? '#ff4d4f' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Falta
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}