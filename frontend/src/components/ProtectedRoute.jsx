import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();
  const path = location.pathname;

  const publicRoutes = ['/', '/login', '/signup', '/admin-login'];

  const adminOnlyRoutes = ['/admin', '/admin/dashboard', '/admin/settings', '/admin/cars', '/admin/bookings', '/admin/reports', '/admin/users']; // extend as needed
  const userOnlyRoutes = ['/profile']; // extend as needed

  // Not logged in: allow only public routes
  if (!token || !role) {
    return publicRoutes.includes(path) ? children : <Navigate to="/login" replace />;
  }

  // Logged in as admin
  if (role === 'admin') {
    if (publicRoutes.includes(path)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userOnlyRoutes.some(route => path.startsWith(route))) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return children;
  }

  // Logged in as user
  if (role === 'user') {
    if (publicRoutes.includes(path)) {
      return <Navigate to="/profile" replace />;
    }
    if (adminOnlyRoutes.some(route => path.startsWith(route))) {
      return <Navigate to="/profile" replace />;
    }
    return children;
  }

  // Fallback
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
