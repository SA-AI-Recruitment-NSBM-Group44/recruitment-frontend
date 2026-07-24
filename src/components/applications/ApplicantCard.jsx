import StatusBadge from "./StatusBadge.jsx";


export default function ApplicantCard({
  applicant,
  onShortlist,
  onReject
}) {

  return (
    <div className="application-card">

      <div className="application-header">

        <h3>
          {applicant.candidateName}
        </h3>


        <span className="score-badge">
          {applicant.matchScore}%
        </span>

      </div>


      <p>
        Status:
      </p>

      <StatusBadge 
        status={applicant.status}
      />


      <div className="application-actions">

        <button
          className="view-button"
          onClick={() => onShortlist(applicant.id)}
        >
          Shortlist
        </button>


        <button
          className="reject-button"
          onClick={() => onReject(applicant)}
        >
          Reject
        </button>

      </div>


    </div>
  );
}