import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, ROLE_HOME } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotAuthorized from './pages/NotAuthorized.jsx';
import CandidateDashboard from './pages/candidate/Dashboard.jsx';
import CandidateApplications from './pages/candidate/Applications.jsx';
import ApplicationDetail from './pages/candidate/ApplicationDetail.jsx';
import RecruiterJobs from './pages/recruiter/Jobs.jsx';
import NewJob from './pages/recruiter/NewJob.jsx';
import ManagerShortlist from './pages/manager/Shortlist.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import RecruiterDashboard from './pages/recruiter/Dashboard.jsx';

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
    <Route
        path="/recruiter/dashboard"
        element={<RecruiterDashboard />}
    />

    <Route
        path="/recruiter/jobs"
        element={<RecruiterJobs />}
    />

    <Route
        path="/recruiter/jobs/new"
        element={<NewJob />}
    />
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
