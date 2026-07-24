import Navbar from "../../components/Navbar.jsx";
import ApplicationCard from "../../components/applications/ApplicationCard.jsx";


export default function CandidateApplications() {

  // Temporary data for UI development
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


  return (
    <>
      <Navbar />

      <main className="page">

        <h2>
          My Applications
        </h2>


        {
          applications.map((application) => (

            <ApplicationCard 
            key={application.id}
            application={application}
            />



          

          ))
        }


      </main>

    </>
  );
}