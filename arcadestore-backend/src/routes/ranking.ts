import { Router } from 'express';
import { auth } from '../middleware/auth';
import Ranking from '../models/Ranking';
import Juego from '../models/Juego';
import User from '../models/User';

const router = Router();

router.post('/', auth, async (req, res) => {
  try {
    const userId = (req as any).user._id; 
    const { juegoId, puntaje } = req.body;

    if (!juegoId || puntaje === undefined) {
      return res.status(400).json({ error: 'juegoId y puntaje son requeridos' });
    }

    const juego = await Juego.findById(juegoId);
    if (!juego) {
      return res.status(404).json({ error: 'Juego no válido' });
    }

    const nuevoRanking = new Ranking({ juegoId, usuarioId: userId, puntaje });
    await nuevoRanking.save();

    res.status(201).json({ mensaje: 'Puntaje guardado', ranking: nuevoRanking });
  } catch (err: any) {
    console.error('Error al guardar puntaje:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/:juegoId', async (req, res) => {
  try {
    const { juegoId } = req.params;

    const juego = await Juego.findById(juegoId);
    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    let rankings;
    if (juego.tipo === 'gratis') {
      rankings = await Ranking.find({ juegoId })
        .sort({ puntaje: -1, fecha: 1 })
        .limit(10)
        .populate('usuarioId', 'nombre');
    } else {
      rankings = await Ranking.find({ juegoId })
        .sort({ puntaje: 1, fecha: 1 })
        .limit(10)
        .populate('usuarioId', 'nombre');
    }

    res.json(rankings);
  } catch (err: any) {
    console.error('Error al obtener ranking:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;