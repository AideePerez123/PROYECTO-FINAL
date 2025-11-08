import { Schema, model } from 'mongoose';

const rankingSchema = new Schema({
  juegoId: { type: Schema.Types.ObjectId, ref: 'Juego', required: true },
  usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  puntaje: { type: Number, required: true }, 
  fecha: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default model('Ranking', rankingSchema);