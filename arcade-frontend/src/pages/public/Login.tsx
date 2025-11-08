import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await publicApi.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/perfil');
    } catch (err: any) {
      alert('Credenciales inválidas o error de red');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-base-100 rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-neutral mb-2">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-neutral mb-2">Contraseña</label>
          <input
            type="password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
