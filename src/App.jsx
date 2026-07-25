import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, ROLE_HOME } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotAuthorized from './pages/NotAuthorized.jsx';

import CandidateDashboard from './pages/candidate/Dashboard.jsx';
import CandidateJobs from './pages/candidate/CandidateJobs.jsx';
import JobDetails from './pages/candidate/JobDetails.jsx';
import Recommendations from './pages/candidate/Recommendations.jsx';
import CandidateApplications from './pages/candidate/Applications.jsx';
import MyApplications from './pages/candidate/MyApplications.jsx';
import ApplicationDetail from './pages/candidate/ApplicationDetail.jsx';
import Profile from './pages/candidate/Profile.jsx';

import RecruiterDashboard from './pages/recruiter/Dashboard.jsx';
import RecruiterJobs from './pages/recruiter/Jobs.jsx';
import NewJob from './pages/recruiter/NewJob.jsx';
import EditJob from './pages/recruiter/EditJob.jsx';
import RecruiterApplications from './pages/recruiter/Applications.jsx';

import ManagerShortlist from './pages/manager/Shortlist.jsx';
import AdminUsers from './pages/admin/Users.jsx';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

      {/* Candidate Routes */}
      <Route element={<ProtectedRoute roles={['Candidate']} />}>
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/jobs" element={<CandidateJobs />} />
        <Route path="/candidate/jobs/:id" element={<JobDetails />} />
        <Route path="/candidate/recommendations" element={<Recommendations />} />
        <Route path="/candidate/applications" element={<MyApplications />} />
        <Route path="/candidate/applications/:id" element={<ApplicationDetail />} />
        <Route path="/candidate/profile" element={<Profile />} />
      </Route>

      {/* Recruiter Routes */}
      <Route element={<ProtectedRoute roles={['Recruiter']} />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/jobs/new" element={<NewJob />} />
        <Route path="/recruiter/jobs/:id/edit" element={<EditJob />} />
        <Route path="/recruiter/jobs/:id/applications" element={<RecruiterApplications />} />
      </Route>

      {/* Hiring Manager Routes */}
      <Route element={<ProtectedRoute roles={['HiringManager']} />}>
        <Route path="/manager/shortlist" element={<ManagerShortlist />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute roles={['Admin']} />}>
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* Default Route */}
      <Route
        path="*"
        element={
          <Navigate
            to={user ? (ROLE_HOME[user.role] ?? '/login') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}