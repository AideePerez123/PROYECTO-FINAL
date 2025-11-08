import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import juegosRoutes from './routes/juegos';
import comprasRoutes from './routes/compras';
import rankingRoutes from './routes/ranking';
import User from './models/User';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'ARCADESTORE Backend funcionando ✅' });
});

app.use('/api/auth', authRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/ranking', rankingRoutes); 

app.use('/api/compras', comprasRoutes); 

const crearAdmin = async () => {
  const adminExiste = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExiste) {
    await User.create({
      nombre: 'Administrador',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      rol: 'admin'
    });
    console.log('Usuario administrador creado');
  } else {
    console.log('El administrador ya existe en la base de datos');
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await crearAdmin();
});