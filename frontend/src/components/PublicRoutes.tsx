import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/Contexts';

export const PublicRoutes = () => {
  const { currentUser } = useContext(AuthContext)!;

  return currentUser ? <Navigate to="/" /> : <Outlet />;
};