import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectIsAuthenticated, selectIsAdmin } from '../../store/slices/authSlice';

// Girişi olmayanı login səhifəsinə, admin olmayanı əsas səhifəyə göndərir
const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
