import { useState, useEffect } from 'react';
import { dbInicial } from '../data/db';
import Navbar from '../components/Navbar';

export default function Cronograma() {
  const [meusEventos, setMeusEventos] = useState([]);

  useEffect(() => {
    // Puxa os IDs das inscrições salvas no navegador
    const inscricoesSalvas = JSON.parse(localStorage.getItem('minhasInscricoes')) || [];
    
    // Filtra apenas os eventos em que o aluno se inscreveu
    const eventosInscritos = dbInicial.eventos.filter(evento => inscricoesSalvas.includes(evento.id));
    
    // US01: Ordena cronologicamente (data e horário)
    eventosInscritos.sort((a, b) => {
      // Extrai apenas as primeiras 5 letras do horário (ex: "19:00") para criar uma data comparável
      const dataHoraA = new Date(`${a.data}T${a.horario.substring(0, 5)}`);
      const dataHoraB = new Date(`${b.data}T${b.horario.substring(0, 5)}`);
      return dataHoraA - dataHoraB;
    });

    setMeusEventos(eventosInscritos);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Meu Cronograma</h1>
        <p>Acompanhe as atividades em que você está inscrito.</p>
        
        {meusEventos.length === 0 ? (
          <p style={{ marginTop: '30px', fontStyle: 'italic', color: '#666' }}>
            Você ainda não se inscreveu em nenhuma atividade. Vá ao Catálogo para explorar!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            {meusEventos.map((evento) => (
              <div key={evento.id} style={{ borderLeft: '5px solid #1890ff', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px', maxWidth: '600px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{evento.titulo} ({evento.tipo})</h3>
                <p style={{ margin: '5px 0' }}><strong>Data:</strong> {evento.data}</p>
                <p style={{ margin: '5px 0' }}><strong>Horário:</strong> {evento.horario}</p>
                <p style={{ margin: '5px 0' }}><strong>Local:</strong> {evento.local}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}