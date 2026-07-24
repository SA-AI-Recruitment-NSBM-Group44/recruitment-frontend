import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, ROLE_HOME } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotAuthorized from './pages/NotAuthorized.jsx';
import CandidateDashboard from './pages/candidate/Dashboard.jsx';
import RecruiterJobs from './pages/recruiter/Jobs.jsx';
import ManagerShortlist from './pages/manager/Shortlist.jsx';
import AdminUsers from './pages/admin/Users.jsx';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

      {/* Candidate */}
      <Route element={<ProtectedRoute roles={['Candidate']} />}>
      <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
      </Route>

      {/* Recruiter */}
      <Route element={<ProtectedRoute roles={['Recruiter']} />}>
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
      </Route>

      {/* Hiring manager */}
      <Route element={<ProtectedRoute roles={['HiringManager']} />}>
        <Route path="/manager/shortlist" element={<ManagerShortlist />} />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute roles={['Admin']} />}>
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* Default: send people to their role home (or login) */}
      <Route path="*" element={<Navigate to={user ? (ROLE_HOME[user.role] ?? '/login') : '/login'} replace />} />
    </Routes>
  );
}
