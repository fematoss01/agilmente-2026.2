import { useState, useEffect } from 'react';
import { dbInicial } from '../data/db';
import Navbar from '../components/Navbar';
import '../App.css';

export default function Catalogo() {
  const [eventos, setEventos] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    const eventosSalvos = localStorage.getItem('eventosData');
    setEventos(eventosSalvos ? JSON.parse(eventosSalvos) : dbInicial.eventos);

    // Chave única de inscrição para não misturar alunos diferentes
    const inscricoesSalvas = JSON.parse(localStorage.getItem(`inscricoes_${usuario?.email}`)) || [];
    setInscricoes(inscricoesSalvas);
  }, [usuario?.email]);

  const toggleInscricao = (eventoId) => {
    const estaInscrito = inscricoes.includes(eventoId);
    const novasInscricoes = estaInscrito ? inscricoes.filter(id => id !== eventoId) : [...inscricoes, eventoId];

    const novosEventos = eventos.map(evento => {
      if (evento.id === eventoId) {
        let listaInscritos = evento.inscritos || [];
        if (estaInscrito) {
          // Remove o aluno da lista do evento
          listaInscritos = listaInscritos.filter(u => u.email !== usuario.email);
        } else {
          // Adiciona o aluno na lista do evento
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

  // Filtra apenas eventos que não estão desativados
  const eventosAtivos = eventos.filter(evento => evento.ativo !== false);

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Catálogo de Eventos</h1>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          {eventosAtivos.map((evento) => {
            const estaInscrito = inscricoes.includes(evento.id);
            const vagasRestantes = evento.vagasTotais - evento.vagasOcupadas;
            const esgotado = vagasRestantes <= 0 && !estaInscrito;

            return (
              <div key={evento.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '300px' }}>
                <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>{evento.titulo}</h2>
                <p style={{ margin: '5px 0' }}><strong>Tipo:</strong> {evento.tipo}</p>
                <p style={{ margin: '5px 0' }}><strong>Data:</strong> {evento.data} - {evento.horario}</p>
                
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