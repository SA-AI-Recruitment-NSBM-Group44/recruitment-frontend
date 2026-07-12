import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function NotAuthorized() {
  return (
    <>
      <Navbar />
      <main className="page">
        <div className="placeholder-card">
          <h2>You do not have access to this page</h2>
          <p>This area belongs to a different role. Head back to your own portal.</p>
          <p style={{ marginTop: 16 }}><Link to="/">Go to my portal</Link></p>
        </div>
      </main>
    </>
  );
}
