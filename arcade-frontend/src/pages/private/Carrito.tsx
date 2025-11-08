import React, { useEffect, useState } from 'react';
import { privateApi } from '../../services/api';

type Juego = {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: 'gratis' | 'pago';
  icono: string;
};

const Carrito = () => {
  const [juegosComprados, setJuegosComprados] = useState<Juego[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJuegosComprados = async () => {
      try {
        const userRes = await privateApi.get('/auth/me');
        const juegosIds = userRes.data.user.juegosComprados || [];

        if (juegosIds.length === 0) {
          setJuegosComprados([]);
          setTotal(0);
          setLoading(false);
          return;
        }

        const juegosRes = await privateApi.post('/juegos/por-ids', { ids: juegosIds });
        const juegos = juegosRes.data;

        setJuegosComprados(juegos);
        const totalPago = juegos
          .filter((juego: Juego) => juego.tipo === 'pago')
          .reduce((sum: number, juego: Juego) => sum + juego.precio, 0);

        setTotal(totalPago);
      } catch (err) {
        console.error('Error al cargar juegos comprados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJuegosComprados();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">esta cargando tu colección...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Mi Colección </h2>
      
      {juegosComprados.length === 0 ? (
        <div className="text-center py-10 bg-base-100 rounded-2xl border border-dashed border-neutral">
          <p className="text-gray-600">aun no a comprado ningun juego</p>
          <a
            href="/tienda"
            className="inline-block btn btn-primary mt-4"
          >
            Ir a la tienda
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {juegosComprados.map(juego => (
              <div key={juego._id} className="card bg-white shadow-lg rounded-2xl p-4">
                <div className="h-36 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  {juego.icono ? (
                    <img src={juego.icono} alt={`${juego.nombre} icono`} className="h-full object-cover w-full" />
                  ) : (
                    <span className="text-neutral">Sin ícono</span>
                  )}
                </div>

                <h3 className="font-semibold text-lg">{juego.nombre}</h3>
                <p className="text-sm text-neutral mt-1 line-clamp-3">{juego.descripcion}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className={`badge ${juego.tipo === 'gratis' ? 'badge-success' : 'badge-error'}`}>
                    {juego.tipo === 'gratis' ? 'Gratis' : `Q${juego.precio}`}
                  </span>
                  <a
                    href={`/jugar/${juego._id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Jugar
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl border border-base-200 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">Total de juegos comprados:</span>
              <span className="font-bold text-xl text-blue-700">{juegosComprados.length} juego(s)</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium text-lg">Total pagado:</span>
              <span className="font-bold text-xl text-green-700">Q{total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
