import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { 
        type: String, 
        enum: ['usuario', 'admin'], 
        default: 'usuario' 
    },
    juegosComprados: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Juego' 
    }]
}, {
    timestamps: true 
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
    });

export default model('User', userSchema);