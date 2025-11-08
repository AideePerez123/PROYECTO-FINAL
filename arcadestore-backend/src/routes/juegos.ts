import { Router } from 'express';
import Juego from '../models/Juego';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const juegos = await Juego.find({ activo: true }).select('-__v');
    res.json(juegos);
  } catch (error: any) {
    console.error('Error al obtener juegos:', error.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user: any = (req as any).user;
    if (user.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
    }

    const { nombre, descripcion, precio, tipo, icono } = req.body;

    if (!nombre || !descripcion || precio === undefined || !tipo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (!['gratis', 'pago'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo debe ser "gratis" o "pago".' });
    }

    if (tipo === 'gratis' && precio !== 0) {
      return res.status(400).json({ error: 'Juegos gratis deben tener precio 0.' });
    }

    if (tipo === 'pago' && precio <= 0) {
      return res.status(400).json({ error: 'Juegos de pago deben tener precio mayor a 0.' });
    }

    const nuevoJuego = new Juego({
      nombre,
      descripcion,
      precio,
      tipo,
      icono: icono || ''
    });

    await nuevoJuego.save();
    res.status(201).json({ mensaje: 'Juego creado exitosamente.', juego: nuevoJuego });
  } catch (error: any) {
    console.error('Error al crear juego:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/:juegoId', auth, async (req, res) => {
  try {
    const { juegoId } = req.params;
    const juego = await Juego.findById(juegoId);
    if (!juego || !juego.activo) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.json(juego);
  } catch (err: any) {
    console.error('Error al obtener juego por ID:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/por-ids', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'IDs inválidos' });
    }
    const juegos = await Juego.find({ _id: { $in: ids }, activo: true });
    res.json(juegos);
  } catch (err: any) {
    console.error('Error al obtener juegos por IDs:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', auth, async (req, res) => {
  if ((req as any).user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  try {
    const { nombre, descripcion, precio, tipo, icono } = req.body;
    const juego = new Juego({ nombre, descripcion, precio, tipo, icono });
    await juego.save();
    res.status(201).json(juego);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear juego' });
  }
router.post('/', auth, async (req, res) => {
  if ((req as any).user.rol !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  const juego = new Juego(req.body);
  await juego.save();
  res.status(201).json(juego);
});
});

export default router;