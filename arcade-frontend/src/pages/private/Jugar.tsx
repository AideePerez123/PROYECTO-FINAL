import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { privateApi } from '../../services/api';
import BalloonPop from '../../components/games/BalloonPop';
import Puzzle from '../../components/games/Puzzle';

const Jugar = () => {
  const { juegoId } = useParams<{ juegoId: string }>();
  const navigate = useNavigate();
  const [juego, setJuego] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!juegoId) {
      navigate('/tienda');
      return;
    }

    const cargarJuegoYVerificar = async () => {
      try {
        const resJuego = await privateApi.get(`/juegos/${juegoId}`);
        const juegoData = resJuego.data;

        const resUser = await privateApi.get('/auth/me');
        const user = resUser.data.user;

        const comprado = user.juegosComprados.some((j: any) => j._id.toString() === juegoId);

        if (juegoData.tipo === 'pago' && !comprado) {
          setError('Debes comprar este juego antes de jugar.');
          setTimeout(() => navigate('/tienda'), 3000);
          setCargando(false);
          return;
        }

        setJuego(juegoData);
        setCargando(false);
      } catch (err: any) {
        console.error('Error:', err);
        setError('Error de conexión.');
        setCargando(false);
        setTimeout(() => navigate('/tienda'), 3000);
      }
    };

    cargarJuegoYVerificar();
  }, [juegoId, navigate]);

  if (cargando) return <div className="text-center mt-20 text-2xl">Cargando</div>;
  if (error) return (
    <div className="text-center mt-20">
      <p className="text-error font-bold">{error}</p>
      <p className="text-sm mt-2">Redirigiendo</p>
    </div>
  );

  if (juego.nombre === 'Balloon Pop') return <BalloonPop juegoId={juegoId!} />;
  if (juego.nombre === 'Puzzle') return <Puzzle juegoId={juegoId!} />;

  return <div className="text-center mt-20">Juego no disponible</div>;
};

export default Jugar;
