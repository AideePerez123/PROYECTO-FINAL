import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi } from '../../services/api'; 

const Ranking = () => {
  const { juegoId } = useParams<{ juegoId: string }>();
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const res = await publicApi.get(`/ranking/${juegoId}`);
      setRanking(res.data);
    };
    fetchRanking();
  }, [juegoId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">TOP 10</h2>
      <ul className="space-y-2">
        {ranking.map((item, i) => (
          <li key={item._id} className="flex justify-between p-3 rounded-lg bg-base-100 border">
            <div>
              <span className="font-semibold">{i + 1}. {item.usuarioId.nombre}</span>
              <p className="text-sm text-neutral">{item.usuarioId.email}</p>
            </div>
            <div className="text-lg font-bold">{item.puntaje}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ranking;
