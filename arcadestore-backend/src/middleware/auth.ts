import { jwtVerify } from 'jose';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const user = await User.findById(payload.userId);
    (req as any).user = user;
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(403).json({ error: 'Token invalido o expirado' });
  }
};