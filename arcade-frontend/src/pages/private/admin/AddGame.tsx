import { useState } from 'react';
import { privateApi } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const AddGame = () => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo: 'gratis' as 'gratis' | 'pago',
    icono: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await privateApi.post('/juegos', form);
      alert('Juego agregado con éxito');
      setForm({ nombre: '', descripcion: '', precio: 0, tipo: 'gratis', icono: '' });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al agregar juego');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-2xl shadow-2xl border border-base-200">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
        Panel Administrador — Agregar Juego
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-base-content">Nombre</label>
          <input
            type="text"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="input input-bordered w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-base-content">Descripción</label>
          <textarea
            required
            rows={3}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="textarea textarea-bordered w-full mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-base-content">Precio (Q)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })}
              className="input input-bordered w-full mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as 'gratis' | 'pago' })}
              className="select select-bordered w-full mt-2"
            >
              <option value="gratis">Gratis</option>
              <option value="pago">De Paga</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-base-content">URL del Icono</label>
          <input
            type="url"
            placeholder="https://ejemplo.com/icono.png"
            value={form.icono}
            onChange={(e) => setForm({ ...form, icono: e.target.value })}
            className="input input-bordered w-full mt-2"
          />
          <p className="text-xs text-neutral mt-1"></p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Agregar Juego'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tienda')}
            className="btn btn-ghost flex-1"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;
