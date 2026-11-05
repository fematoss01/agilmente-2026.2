import { useState, useEffect } from 'react';
import { dbInicial } from '../data/db';
import Navbar from '../components/Navbar';
import '../App.css';

export default function Catalogo() {
  const [eventos] = useState(dbInicial.eventos);
  const [inscricoes, setInscricoes] = useState([]);

  useEffect(() => {
    const inscricoesSalvas = JSON.parse(localStorage.getItem('minhasInscricoes')) || [];
    setInscricoes(inscricoesSalvas);
  }, []);

  const toggleInscricao = (eventoId) => {
    let novasInscricoes;
    
    if (inscricoes.includes(eventoId)) {
      novasInscricoes = inscricoes.filter(id => id !== eventoId);
    } else {
      novasInscricoes = [...inscricoes, eventoId];
    }

    setInscricoes(novasInscricoes);
    localStorage.setItem('minhasInscricoes', JSON.stringify(novasInscricoes));
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Catálogo de Eventos - Agilmente</h1>
        <p>Confira a programação da Semana Acadêmica:</p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          {eventos.map((evento) => {
            const estaInscrito = inscricoes.includes(evento.id);
            const vagasRestantes = evento.vagasTotais - evento.vagasOcupadas - (estaInscrito ? 1 : 0);
            const esgotado = vagasRestantes <= 0 && !estaInscrito;

            return (
              <div key={evento.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '300px' }}>
                <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>{evento.titulo}</h2>
                <p style={{ margin: '5px 0' }}><strong>Tipo:</strong> {evento.tipo}</p>
                <p style={{ margin: '5px 0' }}><strong>Data:</strong> {evento.data}</p>
                <p style={{ margin: '5px 0' }}><strong>Horário:</strong> {evento.horario}</p>
                <p style={{ margin: '5px 0' }}><strong>Local:</strong> {evento.local}</p>
                <p style={{ margin: '5px 0' }}><strong>Ministrante:</strong> {evento.ministrante}</p>
                
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: esgotado ? 'red' : 'green' }}>
                    {esgotado ? 'Vagas Esgotadas' : `${vagasRestantes} vagas disponíveis`}
                  </p>
                </div>

                <button 
                  onClick={() => toggleInscricao(evento.id)}
                  disabled={esgotado}
                  style={{ 
                    marginTop: '15px', 
                    width: '100%', 
                    padding: '10px',
                    backgroundColor: estaInscrito ? '#ff4d4f' : (esgotado ? '#ccc' : '#1890ff'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: esgotado ? 'not-allowed' : 'pointer' 
                  }}
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