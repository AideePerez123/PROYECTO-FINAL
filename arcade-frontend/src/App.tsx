import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/public/Home';
import Tienda from './pages/public/Tienda';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Perfil from './pages/private/Perfil';
import Carrito from './pages/private/Carrito';
import Jugar from './pages/private/Jugar';
import Ranking from './pages/private/Ranking';
import AddGame from './pages/private/admin/AddGame';
import ProtectedRoute from './utils/ProtectedRoute';

const useAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

const App = () => {
  const location = useLocation();
  const user = useAuth();

  const isAdmin = user?.rol === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">ARCADESTORE</Link>
          <div className="flex space-x-4 items-center">
            <Link to="/" className="hover:underline">Inicio</Link>
            <Link to="/tienda" className="hover:underline">Tienda</Link>

            {}
            {user && (
              <>
                <Link to="/perfil" className="hover:underline">Perfil</Link>
                <Link to="/carrito" className="hover:underline">Mis Juegos</Link>
              </>
            )}

            {}
            {isAdmin && (
              <Link to="/admin/juegos" className="btn btn-sm btn-outline btn-primary">
                Admin
              </Link>
            )}

            {}
            {user ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="btn btn-ghost"
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-ghost">Registro</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {}
      <main className="flex-grow container mx-auto p-6">
        <Routes>
          {}
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <Carrito />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jugar/:juegoId"
            element={
              <ProtectedRoute>
                <Jugar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ranking/:juegoId"
            element={
              <ProtectedRoute>
                <Ranking />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/admin/juegos"
            element={
              <ProtectedRoute>
                {isAdmin ? <AddGame /> : <Navigate to="/tienda" />}
              </ProtectedRoute>
            }
          />

          {}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {}
      <footer className="bg-neutral text-white text-center py-4 mt-auto">
        <p>© 2025 ARCADESTORE</p>
      </footer>
    </div>
  );
};

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Root;
