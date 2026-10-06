import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/contexts';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    if (user.role === 'VENDOR') return <Navigate to="/vendor/orders" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
