import { useState, useEffect } from 'react';
import { dbInicial } from '../data/db';
import Navbar from '../components/Navbar';
import '../App.css';

const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const partes = dataStr.split('-');
  if (partes.length !== 3) return dataStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const verificaChoqueHorario = (horario1, horario2) => {
  const extrairMinutos = (str) => {
    const matches = str.match(/\d{1,2}:\d{2}/g);
    if (!matches) return { inicio: 0, fim: 0 };
    
    const calcMinutos = (hStr) => {
      const [h, m] = hStr.split(':').map(Number);
      return (h * 60) + m;
    };
    
    const inicio = calcMinutos(matches[0]);
    const fim = matches.length > 1 ? calcMinutos(matches[1]) : inicio + 60;
    
    return { inicio, fim };
  };

  const t1 = extrairMinutos(horario1);
  const t2 = extrairMinutos(horario2);

  return (t1.inicio < t2.fim) && (t2.inicio < t1.fim);
};

export default function Catalogo() {
  const [eventos, setEventos] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [eventoModal, setEventoModal] = useState(null); 
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    const eventosSalvos = localStorage.getItem('eventosData');
    setEventos(eventosSalvos ? JSON.parse(eventosSalvos) : dbInicial.eventos);
    const inscricoesSalvas = JSON.parse(localStorage.getItem(`inscricoes_${usuario?.email}`)) || [];
    setInscricoes(inscricoesSalvas);
  }, [usuario?.email]);

  const toggleInscricao = (eventoId) => {
    const estaInscrito = inscricoes.includes(eventoId);
    
    if (!estaInscrito) {
      const eventoAlvo = eventos.find(e => e.id === eventoId);
      const temChoque = inscricoes.some(idInscrito => {
        const evtInscrito = eventos.find(e => e.id === idInscrito);
        if (!evtInscrito || evtInscrito.data !== eventoAlvo.data) return false;
        
        return verificaChoqueHorario(evtInscrito.horario, eventoAlvo.horario);
      });

      if (temChoque) {
        alert('Choque de horário! Você já está inscrito em outra atividade no mesmo dia e horário.');
        return;
      }
    }

    const novasInscricoes = estaInscrito ? inscricoes.filter(id => id !== eventoId) : [...inscricoes, eventoId];

    const novosEventos = eventos.map(evento => {
      if (evento.id === eventoId) {
        let listaInscritos = evento.inscritos || [];
        if (estaInscrito) {
          listaInscritos = listaInscritos.filter(u => u.email !== usuario.email);
        } else {
          listaInscritos = [...listaInscritos, usuario];
        }
        return { 
          ...evento, 
          vagasOcupadas: estaInscrito ? evento.vagasOcupadas - 1 : evento.vagasOcupadas + 1,
          inscritos: listaInscritos 
        };
      }
      return evento;
    });

    setInscricoes(novasInscricoes);
    setEventos(novosEventos);
    localStorage.setItem(`inscricoes_${usuario.email}`, JSON.stringify(novasInscricoes));
    localStorage.setItem('eventosData', JSON.stringify(novosEventos));
  };

  const datasComEventos = [...new Set(eventos.filter(e => e.ativo !== false).map(e => e.data))].sort();

  const eventosExibidos = eventos
    .filter(evento => {
      if (evento.ativo === false) return false;
      if (filtroTipo && evento.tipo !== filtroTipo) return false;
      if (filtroData && evento.data !== filtroData) return false;
      return true;
    })
    .sort((a, b) => {
      const dataHoraA = new Date(`${a.data}T${a.horario.substring(0, 5)}`);
      const dataHoraB = new Date(`${b.data}T${b.horario.substring(0, 5)}`);
      return dataHoraA - dataHoraB;
    });

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Catálogo de Eventos</h1>
        
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f2f5', borderRadius: '8px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filtrar por Tipo:</label>
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <option value="">Todos os Eventos</option>
              <option value="Palestra">Palestra</option>
              <option value="Minicurso">Minicurso</option>
              <option value="Mesa-redonda">Mesa-redonda</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Data:</label>
            <select value={filtroData} onChange={e => setFiltroData(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <option value="">Todas as datas</option>
              {datasComEventos.map(d => (
                <option key={d} value={d}>{formatarData(d)}</option>
              ))}
            </select>
          </div>
          <button onClick={() => {setFiltroTipo(''); setFiltroData('');}} style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}>Limpar Filtros</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {eventosExibidos.map((evento) => {
            const estaInscrito = inscricoes.includes(evento.id);
            const vagasRestantes = evento.vagasTotais - evento.vagasOcupadas;
            const esgotado = vagasRestantes <= 0 && !estaInscrito;

            return (
              <div 
                key={evento.id} 
                className="card"
                onClick={() => setEventoModal(evento)}
                style={{ display: 'flex', flexDirection: 'column', padding: '20px', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h2 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: '#1890ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evento.titulo}</h2>
                  <p style={{ margin: '0 0 15px 0', fontSize: '0.9em', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {evento.descricao}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.95em' }}><strong>Tipo:</strong> {evento.tipo}</p>
                  <p style={{ margin: '5px 0', fontSize: '0.95em' }}><strong>Data:</strong> {formatarData(evento.data)} - {evento.horario}</p>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'center', margin: '15px 0' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: esgotado ? '#cf1322' : '#389e0d' }}>
                      {esgotado ? 'Vagas Esgotadas' : `${vagasRestantes} vagas disponíveis`}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleInscricao(evento.id); }} 
                    disabled={esgotado}
                    className="btn-animado"
                    style={{ width: '100%', padding: '10px', backgroundColor: estaInscrito ? '#ff4d4f' : (esgotado ? '#ccc' : '#1890ff'), color: 'white', border: 'none', borderRadius: '6px', cursor: esgotado ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                  >
                    {estaInscrito ? 'Cancelar Inscrição' : (esgotado ? 'Indisponível' : 'Inscrever-se')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {eventoModal && (() => {
          const estaInscrito = inscricoes.includes(eventoModal.id);
          const vagasRestantes = eventoModal.vagasTotais - eventoModal.vagasOcupadas;
          const esgotado = vagasRestantes <= 0 && !estaInscrito;

          return (
            <div 
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}
              onClick={() => setEventoModal(null)}
            >
              <div 
                style={{ 
                  backgroundColor: 'white', 
                  padding: '30px', 
                  borderRadius: '12px', 
                  width: '90%', 
                  maxWidth: '600px', 
                  maxHeight: '85vh', 
                  overflowY: 'auto', 
                  overflowX: 'hidden', 
                  position: 'relative', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
                }}
                onClick={(e) => e.stopPropagation()} 
              >
                <button 
                  onClick={() => setEventoModal(null)} 
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}
                >
                  ✕
                </button>
                
                <h2 style={{ 
                  color: '#1890ff', 
                  marginTop: 0, 
                  wordBreak: 'break-word', 
                  hyphens: 'auto'
                }}>
                  {eventoModal.titulo}
                </h2>
                
                <div style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: '#e6f7ff', color: '#1890ff', borderRadius: '15px', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '15px' }}>
                  {eventoModal.tipo}
                </div>
                
                <p style={{ 
                  lineHeight: '1.6', 
                  color: '#444', 
                  marginBottom: '20px',
                  wordBreak: 'break-word' 
                }}>
                  {eventoModal.descricao}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ margin: 0 }}><strong>Ministrante:</strong><br/>{eventoModal.ministrante}</p>
                  <p style={{ margin: 0 }}><strong>Local:</strong><br/>{eventoModal.local}</p>
                  <p style={{ margin: 0 }}><strong>Data:</strong><br/>{formatarData(eventoModal.data)}</p>
                  <p style={{ margin: 0 }}><strong>Horário:</strong><br/>{eventoModal.horario}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                  <span style={{ fontWeight: 'bold', color: esgotado ? '#cf1322' : '#389e0d', fontSize: '1.1em' }}>
                    {esgotado ? 'Inscrições Encerradas' : `${vagasRestantes} vagas restantes`}
                  </span>
                  
                  <button 
                    onClick={() => { toggleInscricao(eventoModal.id); setEventoModal(null); }} 
                    disabled={esgotado}
                    className="btn-animado"
                    style={{ padding: '12px 24px', backgroundColor: estaInscrito ? '#ff4d4f' : (esgotado ? '#ccc' : '#1890ff'), color: 'white', border: 'none', borderRadius: '6px', cursor: esgotado ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1em' }}
                  >
                    {estaInscrito ? 'Cancelar Inscrição' : (esgotado ? 'Esgotado' : 'Confirmar Inscrição')}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}