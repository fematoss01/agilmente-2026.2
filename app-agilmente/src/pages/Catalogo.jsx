import { useState, useEffect } from 'react';
import { dbInicial } from '../data/db';
import Navbar from '../components/Navbar';
import '../App.css';

// Função para formatar a data de AAAA-MM-DD para DD/MM/AAAA
const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const partes = dataStr.split('-');
  if (partes.length !== 3) return dataStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

// Função matemática para checar sobreposição de intervalos de tempo
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

  // Aplica o filtro de inativos, filtro por tipo e ORDENA CRONOLOGICAMENTE
  const eventosExibidos = eventos
    .filter(evento => {
      if (evento.ativo === false) return false;
      if (filtroTipo && evento.tipo !== filtroTipo) return false;
      return true;
    })
    .sort((a, b) => {
      // Extrai a data e os primeiros 5 caracteres do horário (HH:MM) para comparar
      const dataHoraA = new Date(`${a.data}T${a.horario.substring(0, 5)}`);
      const dataHoraB = new Date(`${b.data}T${b.horario.substring(0, 5)}`);
      return dataHoraA - dataHoraB;
    });

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Catálogo de Eventos</h1>
        
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filtrar por Tipo:</label>
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ padding: '8px' }}>
            <option value="">Todos os Eventos</option>
            <option value="Palestra">Palestra</option>
            <option value="Minicurso">Minicurso</option>
            <option value="Mesa-redonda">Mesa-redonda</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {eventosExibidos.map((evento) => {
            const estaInscrito = inscricoes.includes(evento.id);
            const vagasRestantes = evento.vagasTotais - evento.vagasOcupadas;
            const esgotado = vagasRestantes <= 0 && !estaInscrito;

            return (
              <div key={evento.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '300px' }}>
                <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>{evento.titulo}</h2>
                <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#555' }}>{evento.descricao}</p>
                <hr style={{ border: '0.5px solid #eee' }} />
                <p style={{ margin: '5px 0' }}><strong>Tipo:</strong> {evento.tipo}</p>
                <p style={{ margin: '5px 0' }}><strong>Data:</strong> {formatarData(evento.data)} - {evento.horario}</p>
                <p style={{ margin: '5px 0' }}><strong>Local:</strong> {evento.local}</p>
                <p style={{ margin: '5px 0' }}><strong>Ministrante:</strong> {evento.ministrante}</p>
                
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: esgotado ? 'red' : 'green' }}>
                    {esgotado ? 'Vagas Esgotadas' : `${vagasRestantes} vagas disponíveis`}
                  </p>
                </div>

                <button 
                  onClick={() => toggleInscricao(evento.id)} disabled={esgotado}
                  style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: estaInscrito ? '#ff4d4f' : (esgotado ? '#ccc' : '#1890ff'), color: 'white', border: 'none', borderRadius: '4px', cursor: esgotado ? 'not-allowed' : 'pointer' }}
                >
                  {estaInscrito ? 'Cancelar Inscrição' : (esgotado ? 'Indisponível' : 'Inscrever-se')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}