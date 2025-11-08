import { Router } from 'express';
import { auth } from '../middleware/auth';
import User from '../models/User';
import Juego from '../models/Juego';

const router = Router();

router.post('/', auth, async (req, res) => {
  try {
    const userId = (req as any).user._id;  
    const { juegoId } = req.body;

    if (!juegoId) {
      return res.status(400).json({ error: 'ID del juego es requerido' });
    }

    const juego = await Juego.findById(juegoId);
    if (!juego || !juego.activo) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const yaComprado = user.juegosComprados.some(id => id.toString() === juegoId);
    if (yaComprado) {
      return res.status(400).json({ error: 'Ya has comprado este juego' });
    }

    user.juegosComprados.push(juegoId);
    await user.save();

    console.log(`Juego ${juego.nombre} comprado por usuario ${user.nombre}`);  

    res.json({ 
      mensaje: 'Juego comprado exitosamente', 
      juego: { id: juego._id, nombre: juego.nombre } 
    });
  } catch (err: any) {
    console.error('Error al comprar juego:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;