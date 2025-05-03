import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const AdminRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Spinner />;
  }

  // Check if user exists and has admin or librarian role
  const authorized = user && 
    user.user && 
    (user.user.role === 'admin' || user.user.role === 'librarian');

  if (!authorized) {
    console.log('Access denied: User is not admin or librarian');
  }

  return authorized ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute; 