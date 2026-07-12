import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Recruit<span>AI</span></Link>
      {user && (
        <div className="who">
          <span>{user.name}</span>
          <span className="role-badge">{user.role}</span>
          <button onClick={logout}>Log out</button>
        </div>
      )}
    </nav>
  );
}
