import { useState, useEffect } from 'react';
import { dbInicial } from '../data/db';
import Navbar from '../components/Navbar';

const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const partes = dataStr.split('-');
  if (partes.length !== 3) return dataStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

export default function PainelOrganizador() {
  const [eventos, setEventos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Palestra');
  const [vagasTotais, setVagasTotais] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ministrante, setMinistrante] = useState('');
  const [data, setData] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [local, setLocal] = useState('');

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

  const iniciarEdicao = (evento) => {
    setEditandoId(evento.id);
    setTitulo(evento.titulo);
    setTipo(evento.tipo);
    setVagasTotais(evento.vagasTotais);
    setDescricao(evento.descricao || '');
    setMinistrante(evento.ministrante || '');
    setData(evento.data);
    const partesHorario = evento.horario.split(' - ');
    setHorarioInicio(partesHorario[0] || '');
    setHorarioFim(partesHorario[1] || '');
    setLocal(evento.local);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setTitulo(''); setTipo('Palestra'); setVagasTotais(''); setDescricao('');
    setMinistrante(''); setData(''); setHorarioInicio(''); setHorarioFim(''); setLocal('');
  };

  const salvarEvento = (e) => {
    e.preventDefault();
    const horarioFormatado = `${horarioInicio} - ${horarioFim}`;

    if (editandoId) {
      const novos = eventos.map(ev => ev.id === editandoId ? {
        ...ev, titulo, tipo, vagasTotais: parseInt(vagasTotais), descricao, ministrante, data, horario: horarioFormatado, local
      } : ev);
      salvarEventos(novos);
      alert('Evento atualizado com sucesso!');
    } else {
      const novoEvento = {
        id: Date.now(),
        titulo, tipo, descricao, ministrante, data, horario: horarioFormatado, local,
        vagasTotais: parseInt(vagasTotais),
        vagasOcupadas: 0,
        ativo: true,
        inscritos: []
      };
      salvarEventos([...eventos, novoEvento]);
      alert('Evento criado com sucesso!');
    }
    cancelarEdicao();
  };

  const datasComEventos = [...new Set(eventos.map(e => e.data))].sort();

  const eventosExibidos = eventos
    .filter(evento => {
      if (filtroStatus === 'ativos' && evento.ativo === false) return false;
      if (filtroStatus === 'desativados' && evento.ativo !== false) return false;
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
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>Painel Gerencial</h1>
        
        {!editandoId && (
          <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2>Criar Novo Evento</h2>
            <form onSubmit={salvarEvento} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input type="text" placeholder="Título da Atividade" required value={titulo} onChange={e => setTitulo(e.target.value)} style={{ padding: '8px' }} />
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ padding: '8px' }}>
                <option value="Palestra">Palestra</option>
                <option value="Minicurso">Minicurso</option>
                <option value="Mesa-redonda">Mesa-redonda</option>
              </select>
              <input type="text" placeholder="Breve Descrição" required value={descricao} onChange={e => setDescricao(e.target.value)} style={{ padding: '8px' }} />
              <input type="text" placeholder="Nome do Ministrante" required value={ministrante} onChange={e => setMinistrante(e.target.value)} style={{ padding: '8px' }} />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="date" required value={data} onChange={e => setData(e.target.value)} style={{ padding: '8px', flex: 1 }} />
                <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
                  <input type="time" required value={horarioInicio} onChange={e => setHorarioInicio(e.target.value)} style={{ padding: '8px', flex: 1 }} />
                  <span>às</span>
                  <input type="time" required value={horarioFim} onChange={e => setHorarioFim(e.target.value)} style={{ padding: '8px', flex: 1 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Local" required value={local} onChange={e => setLocal(e.target.value)} style={{ padding: '8px', flex: 2 }} />
                <input type="number" placeholder="Vagas Totais" required value={vagasTotais} onChange={e => setVagasTotais(e.target.value)} style={{ padding: '8px', flex: 1 }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cadastrar Evento
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ margin: 0 }}>Gestão de Eventos</h2>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Data:</label>
              <select value={filtroData} onChange={e => setFiltroData(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="">Todas as datas</option>
                {datasComEventos.map(d => (
                  <option key={d} value={d}>{formatarData(d)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Status:</label>
              <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="todos">Todos</option>
                <option value="ativos">Apenas Ativos</option>
                <option value="desativados">Apenas Desativados</option>
              </select>
            </div>
            <button onClick={() => {setFiltroData(''); setFiltroStatus('todos');}} style={{ padding: '8px 12px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}>Limpar</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {eventosExibidos.length === 0 ? (
             <p style={{ color: '#666', gridColumn: '1/-1' }}>Nenhum evento encontrado para os filtros selecionados.</p>
          ) : (
            eventosExibidos.map(evento => {
              const taxa = evento.vagasTotais > 0 ? ((evento.vagasOcupadas / evento.vagasTotais) * 100).toFixed(0) : 0;
              const isDesativado = evento.ativo === false;
              
              return (
                <div 
                  key={evento.id} 
                  className="card"
                  onClick={() => iniciarEdicao(evento)}
                  style={{ display: 'flex', flexDirection: 'column', padding: '20px', cursor: 'pointer', height: '100%', boxSizing: 'border-box', opacity: isDesativado ? 0.6 : 1 }}
                >
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={evento.titulo}>
                      {evento.titulo} {isDesativado && "(Desativado)"}
                    </h3>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Data:</strong> {formatarData(evento.data)} - {evento.horario}</p>
                    <p style={{ margin: '5px 0' }}><strong>Inscritos:</strong> {evento.vagasOcupadas} / {evento.vagasTotais}</p>
                    <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '4px', height: '20px', marginTop: '10px', marginBottom: '15px' }}>
                      <div style={{ width: `${taxa}%`, backgroundColor: taxa > 80 ? '#ff4d4f' : '#52c41a', height: '100%', borderRadius: '4px', textAlign: 'center', color: 'white', fontSize: '12px', lineHeight: '20px' }}>{taxa}%</div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleStatusEvento(evento.id); }}
                      className="btn-animado"
                      style={{ width: '100%', padding: '10px', backgroundColor: isDesativado ? '#52c41a' : '#ff4d4f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {isDesativado ? 'Ativar' : 'Desativar'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {editandoId && (
          <div 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}
            onClick={cancelarEdicao}
          >
            <div 
              style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button onClick={cancelarEdicao} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
              <h2 style={{ color: '#1890ff', marginTop: 0, marginBottom: '20px' }}>Informações e Edição</h2>
              
              <form onSubmit={salvarEvento} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Título da Atividade</label>
                  <input type="text" required value={titulo} onChange={e => setTitulo(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Tipo</label>
                  <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }}>
                    <option value="Palestra">Palestra</option>
                    <option value="Minicurso">Minicurso</option>
                    <option value="Mesa-redonda">Mesa-redonda</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Ministrante</label>
                  <input type="text" required value={ministrante} onChange={e => setMinistrante(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Descrição</label>
                  <textarea required value={descricao} onChange={e => setDescricao(e.target.value)} rows="3" style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Data</label>
                    <input type="date" required value={data} onChange={e => setData(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Início</label>
                    <input type="time" required value={horarioInicio} onChange={e => setHorarioInicio(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Fim</label>
                    <input type="time" required value={horarioFim} onChange={e => setHorarioFim(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Local</label>
                  <input type="text" required value={local} onChange={e => setLocal(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Vagas Totais</label>
                  <input type="number" required value={vagasTotais} onChange={e => setVagasTotais(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '15px' }}>
                  <button type="submit" className="btn-animado" style={{ width: '100%', padding: '12px', backgroundColor: '#faad14', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}