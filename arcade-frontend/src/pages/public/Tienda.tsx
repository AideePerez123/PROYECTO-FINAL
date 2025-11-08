import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi, privateApi } from '../../services/api';

const Tienda = () => {
  const [juegos, setJuegos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    publicApi.get('/juegos').then(res => setJuegos(res.data));
  }, []);

  const handleAccion = async (juego: any) => {
    if (juego.tipo === 'gratis') {
      navigate(`/jugar/${juego._id}`);
    } else {
      if (!token) {
        alert('Debes iniciar sesión');
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        await privateApi.post('/compras', { juegoId: juego._id });
        alert('¡Juego comprado! Ve a "Mis Juegos"');
        navigate('/mis-juegos');
      } catch (err) {
        alert('Error al comprar');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-purple-700">TIENDA</h1>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {juegos.map(juego => (
          <div key={juego._id} className="card bg-white rounded-2xl shadow-2xl p-6">
            <div className="h-48 bg-neutral-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {juego.icono ? (
                <img src={juego.icono} alt={`${juego.nombre} ícono`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-neutral">Sin ícono</span>
              )}
            </div>
            <h3 className="text-xl font-bold">{juego.nombre}</h3>
            <p className="text-neutral text-sm mb-4 line-clamp-3">{juego.descripcion}</p>
            <div className="flex justify-between items-center">
              <span className={`badge ${juego.tipo === 'gratis' ? 'badge-success' : 'badge-warning'}`}>
                {juego.tipo === 'gratis' ? 'Gratis' : `Q${juego.precio}`}
              </span>
              <button
                onClick={() => handleAccion(juego)}
                disabled={loading}
                className={`btn btn-sm font-semibold ${juego.tipo === 'gratis' ? 'btn-primary' : 'btn-accent'}`}
              >
                {loading ? '...' : (juego.tipo === 'gratis' ? 'Jugar' : 'Comprar')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tienda;
