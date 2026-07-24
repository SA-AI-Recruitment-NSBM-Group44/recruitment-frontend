import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, ROLE_HOME } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotAuthorized from './pages/NotAuthorized.jsx';

import CandidateDashboard from './pages/candidate/Dashboard.jsx';
<<<<<<< HEAD
import Recommendations from './pages/candidate/Recommendations.jsx';

=======
import CandidateApplications from './pages/candidate/Applications.jsx';
import ApplicationDetail from './pages/candidate/ApplicationDetail.jsx';
>>>>>>> f8f41e311d4b48a07ea3678ce7fceb3d53c90b43
import RecruiterJobs from './pages/recruiter/Jobs.jsx';
import NewJob from './pages/recruiter/NewJob.jsx';
import ManagerShortlist from './pages/manager/Shortlist.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import RecruiterDashboard from './pages/recruiter/Dashboard.jsx';


export default function App() {

  const { user } = useAuth();


  return (

    <Routes>

      {/* Public Routes */}

      <Route 
        path="/login" 
        element={<Login />} 
      />

      <Route 
        path="/register" 
        element={<Register />} 
      />

      <Route 
        path="/not-authorized" 
        element={<NotAuthorized />} 
      />



      {/* Candidate Routes */}

      <Route element={<ProtectedRoute roles={['Candidate']} />}>

        <Route 
          path="/candidate/dashboard" 
          element={<CandidateDashboard />} 
        />

        <Route 
          path="/candidate/recommendations" 
          element={<Recommendations />} 
        />

      </Route>



      {/* Recruiter Routes */}

      <Route element={<ProtectedRoute roles={['Recruiter']} />}>
<<<<<<< HEAD

        <Route 
          path="/recruiter/jobs" 
          element={<RecruiterJobs />} 
        />

      </Route>
=======
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
>>>>>>> f8f41e311d4b48a07ea3678ce7fceb3d53c90b43



      {/* Hiring Manager Routes */}

      <Route element={<ProtectedRoute roles={['HiringManager']} />}>

        <Route 
          path="/manager/shortlist" 
          element={<ManagerShortlist />} 
        />

      </Route>



      {/* Admin Routes */}

      <Route element={<ProtectedRoute roles={['Admin']} />}>

        <Route 
          path="/admin/users" 
          element={<AdminUsers />} 
        />

      </Route>



      {/* Default Route */}

      <Route 
        path="*" 
        element={
          <Navigate 
            to={
              user 
              ? (ROLE_HOME[user.role] ?? '/login') 
              : '/login'
            } 
            replace 
          />
        } 
      />


    </Routes>

  );
}