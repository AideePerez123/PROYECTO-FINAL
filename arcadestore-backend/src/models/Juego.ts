
import { Schema, model } from 'mongoose';

const juegoSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  tipo: { type: String, enum: ['gratis', 'pago'], required: true },
  icono: { type: String, default: '' },
  activo: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default model('Juego', juegoSchema);