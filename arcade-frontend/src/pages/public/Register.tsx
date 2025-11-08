
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../services/api';

const Register = () => {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await publicApi.post('/auth/register', form);
      alert('Usuario creado. Ahora inicia sesión.');
      navigate('/login');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-base-100 rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold text-center mb-6">Registro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input input-bordered w-full" required />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input input-bordered w-full" required />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input input-bordered w-full" required />
        <button type="submit" className="btn btn-success w-full">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
