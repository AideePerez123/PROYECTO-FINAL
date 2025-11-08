import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  console.log("token", token);
  if (!token) {
    console.log("No hay token");
    return <Navigate to="/login" />;
  }
  console.log("se encontro el token");
  return <>{children}</>;
};

export default ProtectedRoute;