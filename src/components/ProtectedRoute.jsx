import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children, tokenKey = 'token', redirectTo = '/login' }) {
  const location = useLocation();
  const token = localStorage.getItem(tokenKey) || (tokenKey === 'token' ? localStorage.getItem('adminToken') : null);

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}
