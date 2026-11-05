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

  // Estados do formulário
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

  const eventosExibidos = eventos.filter(evento => {
    if (filtroStatus === 'ativos') return evento.ativo !== false;
    if (filtroStatus === 'desativados') return evento.ativo === false;
    return true; 
  });

  return (
    <>
      <Navbar />
      {/* Container centralizado com limite de largura */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>Painel Gerencial</h1>
        
        {/* Formulário */}
        <div style={{ backgroundColor: editandoId ? '#fffbe6' : '#f0f2f5', border: editandoId ? '1px solid #ffe58f' : 'none', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h2>{editandoId ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
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
                {editandoId ? 'Salvar Alterações' : 'Cadastrar Evento'}
              </button>
              {editandoId && (
                <button type="button" onClick={cancelarEdicao} style={{ padding: '10px 20px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Gestão de Eventos com Filtro */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Gestão de Eventos</h2>
          <div>
            <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filtrar por Status:</label>
            <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ padding: '8px' }}>
              <option value="todos">Todos</option>
              <option value="ativos">Apenas Ativos</option>
              <option value="desativados">Apenas Desativados</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {eventosExibidos.map(evento => {
            const taxa = evento.vagasTotais > 0 ? ((evento.vagasOcupadas / evento.vagasTotais) * 100).toFixed(0) : 0;
            const isDesativado = evento.ativo === false;
            
            return (
              <div key={evento.id} style={{ border: '1px solid #ccc', padding: '15px', width: '300px', borderRadius: '8px', opacity: isDesativado ? 0.6 : 1, position: 'relative' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{evento.titulo} {isDesativado && "(Desativado)"}</h3>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Data:</strong> {formatarData(evento.data)} - {evento.horario}</p>
                <p style={{ margin: '5px 0' }}><strong>Inscritos:</strong> {evento.vagasOcupadas} / {evento.vagasTotais}</p>
                <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '4px', height: '20px', marginTop: '10px', marginBottom: '15px' }}>
                  <div style={{ width: `${taxa}%`, backgroundColor: taxa > 80 ? '#ff4d4f' : '#52c41a', height: '100%', borderRadius: '4px', textAlign: 'center', color: 'white', fontSize: '12px', lineHeight: '20px' }}>{taxa}%</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => iniciarEdicao(evento)} style={{ flex: 1, padding: '8px', backgroundColor: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => toggleStatusEvento(evento.id)} style={{ flex: 1, padding: '8px', backgroundColor: isDesativado ? '#52c41a' : '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {isDesativado ? 'Ativar' : 'Desativar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}