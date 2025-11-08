import React, { useState, useEffect, useCallback } from 'react';

type BalloonType = {
  color: string;
  top: number;
  left: number;
  id: number;
  size: number;
};

const BalloonPop = ({ juegoId }: { juegoId: string }) => {
  const [listaBalloon, setListaBalloon] = useState<BalloonType[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const createBalloon = (): BalloonType => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-400",
      "bg-pink-500",
      "bg-purple-500",
    ];

    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      top: Math.floor(Math.random() * 70),
      left: Math.floor(Math.random() * 70),
      id: Date.now() + Math.random(),
      size: Math.floor(Math.random() * (100 - 25 + 1)) + 25,
    };
  };

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setListaBalloon((prevList) => [...prevList, createBalloon()]);
    }, 2000);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      setListaBalloon([]);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const autoDeleteBalloon = useCallback((id: number) => {
    setListaBalloon((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handlePop = (id: number) => {
    if (gameOver) return;
    setScore((prev) => prev + 1);
    autoDeleteBalloon(id);
    setListaBalloon((prev) => [...prev, createBalloon()]);
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
        body: JSON.stringify({ juegoId, puntaje: score })
      });
      alert(`¡Juego terminado! Puntaje: ${score} globos reventados.`);
    } catch (err) {
      console.error('Error al guardar puntaje:', err);
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setListaBalloon([]);
  };

  useEffect(() => {
    if (gameOver) {
      guardarPuntaje();
    }
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center p-10 text-center text-white min-h-screen bg-gradient-to-b from-blue-900 to-purple-900">
      <h1 className="text-3xl font-bold mb-4 text-light-blue-400">BALLOON POP :)</h1>

      <div className="mb-4 text-xl">
        Tiempo: <span className="text-yellow-300 font-bold">{timeLeft}</span>
      </div>
      <div className="mb-4 text-xl">
        Puntuación: <span className="text-pink-400 font-bold">{score}</span>
      </div>

      <div className="relative border-2 border-pink-600 w-[600px] aspect-[6/5] overflow-hidden bg-gray-800 rounded-lg">
        {listaBalloon.map((balloon) => (
          <div
            key={balloon.id}
            className={`absolute ${balloon.color} rounded-full cursor-pointer transition-transform duration-200 hover:scale-110`}
            style={{
              top: `${balloon.top}%`,
              left: `${balloon.left}%`,
              width: `${balloon.size}px`,
              height: `${balloon.size}px`,
            }}
            onClick={() => handlePop(balloon.id)}
          />
        ))}
      </div>

      {gameOver && (
        <div className="mt-6">
          <p className="text-2xl text-pink-400 font-semibold">Juego Terminado</p>
          <p className="text-xl mt-2">Globos reventados: <span className="text-yellow-300">{score}</span></p>
          <button
            onClick={restartGame}
            className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
          >
            Jugar de Nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default BalloonPop;