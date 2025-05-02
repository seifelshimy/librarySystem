import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const AdminRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Spinner />;
  }

  // Check if user is admin or librarian
  const authorized =
    user &&
    (user.user.role === 'admin' || user.user.role === 'librarian');

  return authorized ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute; 