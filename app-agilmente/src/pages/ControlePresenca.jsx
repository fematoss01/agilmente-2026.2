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
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState('');
  const [presencasGlobais, setPresencasGlobais] = useState({});

  useEffect(() => {
    const eventosSalvos = localStorage.getItem('eventosData');
    setEventos(eventosSalvos ? JSON.parse(eventosSalvos) : dbInicial.eventos);
    
    const presencasSalvas = JSON.parse(localStorage.getItem('presencasGlobais')) || {};
    setPresencasGlobais(presencasSalvas);
  }, []);

  // Extrai datas únicas que possuem eventos para popular o primeiro select
  const datasComEventos = [...new Set(eventos.map(e => e.data))].sort();
  
  // Extrai apenas os eventos correspondentes à data selecionada
  const eventosDaData = eventos.filter(e => e.data === dataSelecionada);

  // Reseta o evento selecionado se a data for alterada
  useEffect(() => {
    setEventoSelecionadoId('');
  }, [dataSelecionada]);

  const registrarPresenca = (eventoId, email, status) => {
    const novasPresencas = {
      ...presencasGlobais,
      [eventoId]: {
        ...(presencasGlobais[eventoId] || {}),
        [email]: status
      }
    };
    
    setPresencasGlobais(novasPresencas);
    localStorage.setItem('presencasGlobais', JSON.stringify(novasPresencas));
  };

  const eventoAtual = eventosDaData.find(e => e.id.toString() === eventoSelecionadoId);
  const listaInscritos = eventoAtual?.inscritos || [];
  const presencasDoEvento = presencasGlobais[eventoSelecionadoId] || {};

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>Controle de Presença</h1>
        <p>Siga os passos abaixo para realizar a chamada dos inscritos.</p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
          
          {/* Passo 1: Selecionar a Data */}
          <div style={{ backgroundColor: '#f0f2f5', padding: '15px', borderRadius: '8px', minWidth: '250px', flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>1. Selecione a Data:</label>
            <select 
              value={dataSelecionada} 
              onChange={e => setDataSelecionada(e.target.value)} 
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
            >
              <option value="">-- Escolha uma data --</option>
              {datasComEventos.map(data => (
                <option key={data} value={data}>{formatarData(data)}</option>
              ))}
            </select>
          </div>

          {/* Passo 2: Selecionar o Evento (habilita apenas após selecionar a data) */}
          <div style={{ backgroundColor: '#f0f2f5', padding: '15px', borderRadius: '8px', minWidth: '350px', flex: 2, opacity: dataSelecionada ? 1 : 0.5 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>2. Selecione o Evento:</label>
            <select 
              value={eventoSelecionadoId} 
              onChange={e => setEventoSelecionadoId(e.target.value)} 
              disabled={!dataSelecionada}
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
            >
              <option value="">
                {dataSelecionada ? '-- Escolha o evento --' : 'Selecione uma data primeiro'}
              </option>
              {eventosDaData.map(e => (
                <option key={e.id} value={e.id}>{e.titulo} ({e.horario}) {e.ativo === false ? '(Desativado)' : ''}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Tabela de Presença */}
        {eventoSelecionadoId ? (
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#fafafa', padding: '15px', borderBottom: '1px solid #ddd' }}>
              <h2 style={{ margin: 0, fontSize: '1.2em', color: '#333' }}>
                {eventoAtual?.titulo} 
                {eventoAtual?.ativo === false && <span style={{ color: '#ff4d4f', fontSize: '0.8em', marginLeft: '10px' }}>(Desativado)</span>}
              </h2>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                Horário: {eventoAtual?.horario} | Local: {eventoAtual?.local} | Inscritos: {eventoAtual?.vagasOcupadas}
              </p>
            </div>
            
            <div style={{ overflowX: 'auto', padding: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '8px', borderBottom: '2px solid #ccc' }}>RA</th>
                    <th style={{ padding: '8px', borderBottom: '2px solid #ccc' }}>Nome</th>
                    <th style={{ padding: '8px', borderBottom: '2px solid #ccc' }}>Chamada</th>
                  </tr>
                </thead>
                <tbody>
                  {listaInscritos.length === 0 ? (
                    <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#888' }}>Sem inscrições.</td></tr>
                  ) : (
                    listaInscritos.map((aluno, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fcfcfc' }}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{aluno.ra}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{aluno.nome}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                          <button 
                            onClick={() => registrarPresenca(eventoAtual.id, aluno.email, 'presente')} 
                            style={{ marginRight: '8px', padding: '4px 10px', fontSize: '12px', backgroundColor: presencasDoEvento[aluno.email] === 'presente' ? '#52c41a' : '#e0e0e0', color: presencasDoEvento[aluno.email] === 'presente' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Presente
                          </button>
                          <button 
                            onClick={() => registrarPresenca(eventoAtual.id, aluno.email, 'falta')} 
                            style={{ padding: '4px 10px', fontSize: '12px', backgroundColor: presencasDoEvento[aluno.email] === 'falta' ? '#ff4d4f' : '#e0e0e0', color: presencasDoEvento[aluno.email] === 'falta' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fafafa', border: '1px dashed #ccc', borderRadius: '8px', color: '#666' }}>
            Selecione uma data e um evento para visualizar a lista de presença.
          </div>
        )}
      </div>
    </>
  );
}