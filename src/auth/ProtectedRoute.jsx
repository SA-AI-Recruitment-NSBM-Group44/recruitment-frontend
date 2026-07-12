import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

/**
 * Wrap role-specific routes:
 *   <Route element={<ProtectedRoute roles={['Recruiter']} />}> ... </Route>
 * No token -> /login. Wrong role -> /not-authorized.
 */
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/not-authorized" replace />;
  return <Outlet />;
}
