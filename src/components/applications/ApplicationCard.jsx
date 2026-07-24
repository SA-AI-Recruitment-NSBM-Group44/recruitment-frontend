import StatusBadge from "./StatusBadge.jsx";
import { useNavigate } from "react-router-dom";


export default function ApplicationCard({ application }) {

  const navigate = useNavigate();


  return (
    <div className="application-card">

      <div className="application-header">

        <h3>
          {application.jobTitle}
        </h3>

        <StatusBadge 
          status={application.status} 
        />

      </div>


      <div className="application-details">

        <p>
          <strong>Applied date:</strong>{" "}
          {new Date(application.appliedDate).toLocaleDateString()}
        </p>


        <p>
          <strong>Status:</strong>{" "}
          {application.status}
        </p>

      </div>


      <button
        className="view-button"
        onClick={() =>
          navigate(`/candidate/applications/${application.id}`)
        }
      >
        View Details
      </button>


    </div>
  );
}