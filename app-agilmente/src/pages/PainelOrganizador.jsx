import { useState, useEffect } from 'react';
import { dbInicial } from '../data/db';
import Navbar from '../components/Navbar';

export default function PainelOrganizador() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState('');
  const [presencas, setPresencas] = useState({});

  // Estados do formulário de novo evento
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoTipo, setNovoTipo] = useState('Palestra');
  const [novasVagas, setNovasVagas] = useState('');

  useEffect(() => {
    const eventosSalvos = localStorage.getItem('eventosData');
    setEventos(eventosSalvos ? JSON.parse(eventosSalvos) : dbInicial.eventos);
  }, []);

  const salvarEventos = (novos) => {
    setEventos(novos);
    localStorage.setItem('eventosData', JSON.stringify(novos));
  };

  const toggleStatusEvento = (id) => {
    const novos = eventos.map(e => e.id === id ? { ...e, ativo: e.ativo === false ? true : false } : e);
    salvarEventos(novos);
  };

  const criarEvento = (e) => {
    e.preventDefault();
    const novoEvento = {
      id: Date.now(),
      titulo: novoTitulo,
      tipo: novoTipo,
      data: "2026-11-15", horario: "14:00 - 16:00", local: "A definir", ministrante: "A definir",
      vagasTotais: parseInt(novasVagas),
      vagasOcupadas: 0,
      ativo: true,
      inscritos: []
    };
    salvarEventos([...eventos, novoEvento]);
    setNovoTitulo(''); setNovasVagas('');
    alert('Evento criado com sucesso!');
  };

  const registrarPresenca = (email, status) => {
    setPresencas(prev => ({ ...prev, [email]: status }));
  };

  const eventoAtual = eventos.find(e => e.id.toString() === eventoSelecionadoId);
  const listaInscritos = eventoAtual?.inscritos || [];

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Painel Gerencial</h1>
        
        {/* RF03: Criar Atividades */}
        <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h2>Criar Novo Evento</h2>
          <form onSubmit={criarEvento} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Título da Atividade" required value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} style={{ padding: '8px' }} />
            <select value={novoTipo} onChange={e => setNovoTipo(e.target.value)} style={{ padding: '8px' }}>
              <option value="Palestra">Palestra</option>
              <option value="Minicurso">Minicurso</option>
            </select>
            <input type="number" placeholder="Total de Vagas" required value={novasVagas} onChange={e => setNovasVagas(e.target.value)} style={{ padding: '8px', width: '120px' }} />
            <button type="submit" style={{ padding: '9px 15px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cadastrar Evento</button>
          </form>
        </div>

        {/* RF13: Taxa de Ocupação e RF04: Desativar */}
        <h2>Gestão de Eventos</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {eventos.map(evento => {
            const taxa = evento.vagasTotais > 0 ? ((evento.vagasOcupadas / evento.vagasTotais) * 100).toFixed(0) : 0;
            const isDesativado = evento.ativo === false;
            
            return (
              <div key={evento.id} style={{ border: '1px solid #ccc', padding: '15px', width: '300px', borderRadius: '8px', opacity: isDesativado ? 0.6 : 1 }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{evento.titulo} {isDesativado && "(Desativado)"}</h3>
                <p style={{ margin: '5px 0' }}><strong>Inscritos:</strong> {evento.vagasOcupadas} / {evento.vagasTotais}</p>
                <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '4px', height: '20px', marginTop: '10px', marginBottom: '15px' }}>
                  <div style={{ width: `${taxa}%`, backgroundColor: taxa > 80 ? '#ff4d4f' : '#52c41a', height: '100%', borderRadius: '4px', textAlign: 'center', color: 'white', fontSize: '12px', lineHeight: '20px' }}>{taxa}%</div>
                </div>
                <button onClick={() => toggleStatusEvento(evento.id)} style={{ width: '100%', padding: '8px', backgroundColor: isDesativado ? '#52c41a' : '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {isDesativado ? 'Ativar Evento' : 'Desativar Evento'}
                </button>
              </div>
            );
          })}
        </div>

        {/* US03 e RF12: Lista de Presença Específica */}
        <h2>Controle de Presença</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Selecione o Evento para a Chamada: </label>
          <select value={eventoSelecionadoId} onChange={e => setEventoSelecionadoId(e.target.value)} style={{ padding: '8px', minWidth: '300px' }}>
            <option value="">-- Escolha um evento --</option>
            {eventos.map(e => (
              <option key={e.id} value={e.id}>{e.titulo}</option>
            ))}
          </select>
        </div>

        {eventoSelecionadoId && (
          <table style={{ width: '100%', maxWidth: '800px', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                <th style={{ padding: '12px', borderBottom: '2px solid #ccc' }}>RA</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ccc' }}>Nome do Aluno</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ccc' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {listaInscritos.length === 0 ? (
                <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center' }}>Nenhum aluno inscrito neste evento ainda.</td></tr>
              ) : (
                listaInscritos.map((aluno, index) => (
                  <tr key={index}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{aluno.ra}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{aluno.nome}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                      <button onClick={() => registrarPresenca(aluno.email, 'presente')} style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: presencas[aluno.email] === 'presente' ? '#52c41a' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Presente</button>
                      <button onClick={() => registrarPresenca(aluno.email, 'falta')} style={{ padding: '6px 12px', backgroundColor: presencas[aluno.email] === 'falta' ? '#ff4d4f' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Falta</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}