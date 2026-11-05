import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const partes = dataStr.split('-');
  if (partes.length !== 3) return dataStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

export default function Cronograma() {
  const [meusEventos, setMeusEventos] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const inscricoesSalvas = JSON.parse(localStorage.getItem(`inscricoes_${usuario?.email}`)) || [];
    
    const eventosSalvos = localStorage.getItem('eventosData');
    const baseEventos = eventosSalvos ? JSON.parse(eventosSalvos) : [];
    
    const eventosInscritos = baseEventos.filter(evento => inscricoesSalvas.includes(evento.id));
    
    eventosInscritos.sort((a, b) => {
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
        
        {meusEventos.length === 0 ? (
          <p style={{ marginTop: '30px', fontStyle: 'italic', color: '#666' }}>
            Você ainda não se inscreveu em nenhuma atividade. Vá ao Catálogo para explorar!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            {meusEventos.map((evento) => (
              <div key={evento.id} style={{ borderLeft: '5px solid #1890ff', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px', maxWidth: '600px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{evento.titulo} ({evento.tipo})</h3>
                <p style={{ margin: '5px 0' }}><strong>Data:</strong> {formatarData(evento.data)} - {evento.horario}</p>
                <p style={{ margin: '5px 0' }}><strong>Local:</strong> {evento.local}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}