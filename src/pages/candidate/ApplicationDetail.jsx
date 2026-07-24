import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import StatusTimeline from "../../components/applications/StatusTimeline.jsx";

export default function ApplicationDetail() {
  const { id } = useParams();

  // Temporary data until application detail endpoint is available
  const applications = [
    {
      id: 1,
      jobTitle: "Software Engineer",
      status: "Submitted",
      appliedDate: "2026-07-20"
    },
    {
      id: 2,
      jobTitle: "Frontend Developer",
      status: "Shortlisted",
      appliedDate: "2026-07-18"
    },
    {
      id: 3,
      jobTitle: "QA Engineer",
      status: "Rejected",
      appliedDate: "2026-07-15"
    }
  ];

  const application = applications.find(
    (a) => a.id === Number(id)
  );

  if (!application) {
    return (
      <>
        <Navbar />
        <main className="page">
          <p>Application not found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page">
        <div className="application-card">
          <h2>{application.jobTitle}</h2>

          <p>
            Applied date: {application.appliedDate}
          </p>

          <h3>Application Progress</h3>

          <StatusTimeline
            currentStatus={application.status}
          />
        </div>
      </main>
    </>
  );
}