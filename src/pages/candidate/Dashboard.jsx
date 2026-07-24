import { Link } from 'react-router-dom';
import Placeholder from '../../components/Placeholder.jsx';

export default function CandidateDashboard() {
  return (
    <div>

      <Placeholder
        title="Candidate dashboard"
        description="Profile editor, CV manager and AI job recommendations land here."
        owner="Chamudi (profile + CVs) · Dimuthu (recommendations)"
      />


      <div className="recommend-button-container">

        <Link to="/candidate/recommendations">

          <button className="recommend-button">

            🤖 View AI Recommendations

          </button>

        </Link>

      </div>


    </div>
  );
}