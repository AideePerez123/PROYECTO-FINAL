import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import User from '../models/User';
import { auth } from '../middleware/auth';

const router = Router();


router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos: nombre, email y password son requeridos' });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }

    const user = new User({ nombre, email, password, rol: 'usuario' });
    await user.save();

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (err: any) {
    console.error('Error en registro:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user._id.toString(), rol: user.rol })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        juegosComprados: user.juegosComprados
      }
    });
  } catch (err: any) {
    console.error('Error en login:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById((req as any).user._id)
      .select('-password') 
      .populate('juegosComprados', 'nombre precio tipo icono');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (err: any) {
    console.error('Error al obtener usuario:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;