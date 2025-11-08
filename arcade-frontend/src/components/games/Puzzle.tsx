import React, { useState, useEffect } from 'react';

interface PiezaProps {
  indiceImagen: number | null;
  onClick: () => void;
  isMovable: boolean;
}

const Pieza = ({ indiceImagen, onClick, isMovable }: PiezaProps) => {
  return (
    <button
      onClick={onClick}
      disabled={!isMovable && indiceImagen !== null}
      className={`
        border-2 aspect-square w-full transition-all duration-200
        ${indiceImagen === null 
          ? 'border-blue-400 bg-white cursor-default' 
          : 'border-amber-400 cursor-pointer hover:scale-95'
        }
        ${isMovable ? 'ring-4 ring-green-400 ring-offset-2' : ''}
      `}
      style={{
        backgroundImage: indiceImagen !== null ? `url(/puzzle.jpg)` : 'none',
        backgroundSize: '300% 300%',
        backgroundPosition: indiceImagen !== null 
          ? `${((indiceImagen - 1) % 3) * 33.33}% ${Math.floor((indiceImagen - 1) / 3) * 33.33}%`
          : 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

const Puzzle = ({ juegoId }: { juegoId: string }) => {
  const [matriz, setMatriz] = useState<(number | null)[]>([
    1, 2, 3,
    4, 5, 6,
    7, 8, null
  ]);
  const [movimientos, setMovimientos] = useState(0);

  const vacioIndex = matriz.indexOf(null);

  const mover = (indice: number) => {
    if (matriz[indice] === null) return;

    const filaV = Math.floor(vacioIndex / 3);
    const colV = vacioIndex % 3;
    const fila = Math.floor(indice / 3);
    const col = indice % 3;

    const esAdyacente =
      (Math.abs(fila - filaV) === 1 && col === colV) ||
      (Math.abs(col - colV) === 1 && fila === filaV);

    if (esAdyacente) {
      const nuevo = [...matriz];
      [nuevo[vacioIndex], nuevo[indice]] = [nuevo[indice], nuevo[vacioIndex]];
      setMatriz(nuevo);
      setMovimientos(movimientos + 1);
    }
  };

  const esMovible = (indice: number): boolean => {
    if (matriz[indice] === null) return false;
    const fila = Math.floor(indice / 3);
    const col = indice % 3;
    const filaV = Math.floor(vacioIndex / 3);
    const colV = vacioIndex % 3;
    return (
      (Math.abs(fila - filaV) === 1 && col === colV) ||
      (Math.abs(col - colV) === 1 && fila === filaV)
    );
  };

  const solucion = [1, 2, 3, 4, 5, 6, 7, 8, null];
  const gano = matriz.every((v, i) => v === solucion[i]);

  const reiniciar = () => {
    let mezclado = [...solucion];
    do {
      for (let i = mezclado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mezclado[i], mezclado[j]] = [mezclado[j], mezclado[i]];
      }
    } while (mezclado.every((v, i) => v === solucion[i]));
    setMatriz(mezclado);
    setMovimientos(0);
  };

  const guardarPuntaje = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ juegoId, puntaje: movimientos })
      });
      alert(`¡Puzzle resuelto en ${movimientos} movimientos!`);
    } catch (err) {
      console.error('Error al guardar puntaje:', err);
    }
  };

  useEffect(() => {
    reiniciar();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          PUZZLE :)
        </h1>

        <p className="text-center text-lg mb-4">
          Movimientos = <strong className="text-3xl font-bold">{movimientos}</strong>
        </p>

        {gano && (
          <div className="alert alert-success shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Completado en {movimientos} movimientos</span>
          </div>
        )}

        <div className="w-96 h-96 mx-auto mb-6 bg-gray-800 p-3 rounded-xl shadow-inner">
          <div className="grid grid-cols-3 gap-2 h-full">
            {matriz.map((pieza, i) => (
              <Pieza
                key={i}
                indiceImagen={pieza}
                onClick={() => mover(i)}
                isMovable={esMovible(i)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={reiniciar}
          className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
        >
          Nueva Partida
        </button>

        {gano && (
          <button
            onClick={guardarPuntaje}
            className="btn btn-success w-full"
          >
            Guardar en Ranking
          </button>
        )}
      </div>
    </div>
  );
};

export default Puzzle;