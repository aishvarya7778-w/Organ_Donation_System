import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children, tokenKey = 'adminToken', redirectTo = '/login' }) {
  const location = useLocation();
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}
