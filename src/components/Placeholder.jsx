import Navbar from './Navbar.jsx';

/** Temporary module shell — replace with the real pages as each slice lands. */
export default function Placeholder({ title, description, owner }) {
  return (
    <>
      <Navbar />
      <main className="page">
        <div className="placeholder-card">
          <h2>{title}</h2>
          <p>{description}</p>
          <span className="owner">Module owner: {owner}</span>
        </div>
      </main>
    </>
  );
}
