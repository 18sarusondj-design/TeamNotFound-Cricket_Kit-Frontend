import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const SuperAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== 'ROLE_SUPERADMIN') {
    toast.error('Access Denied. Super Admin only.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default SuperAdminRoute;
