<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import client from "../../api/client";





export default function Applications() {
    console.log("Applications page loaded");
    const { id } = useParams();

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
    try {

        const res = await client.get(`/api/jobapplications/job/${id}`);

        console.log("FULL RESPONSE", res);
console.log("DATA", res.data);

        setApplications(res.data);
        

    } catch (err) {
        console.log(err);
        alert("Failed to load applications.");
    }};


    const updateStatus = async (applicationId, status) => {
    try {

        await client.put(
            `/api/jobapplications/${applicationId}/status`,
            { status }
        );

        alert("Application status updated successfully.");

        loadApplications();

    } catch (err) {

        console.log(err);
        alert("Failed to update application status.");

    }
};




    return (
        <>
            <Navbar />

            <div className="page">
                <div className="jobs-header">
                    <div>
                        <h1>Job Applications</h1>
                        
                        <p>Applications received for this job.</p>
                    </div>
                </div>

                <div className="jobs-card">
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Email</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {applications.length === 0 ? (

                                <tr>
                                    <td colSpan="5" className="empty-row">
                                        No applications found.
                                    </td>
                                </tr>

                            ) : (

                                applications.map(app => (

                                    <tr key={app.id}>
                                        <td>{app.candidateName}</td>
                                        <td>{app.candidateEmail}</td>
                                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                        <td>{app.status}</td>

                                        <td style={{ display: "flex", gap: "8px", alignItems: "center" }}>
    <button
    className="status-btn review-btn"
    onClick={() => updateStatus(app.id, 2)}
>
    Under Review
</button>

    <button
    className="status-btn shortlist-btn"
    onClick={() => updateStatus(app.id, 3)}
>
    Shortlist
</button>

    <button
    className="status-btn reject-btn"
    onClick={() => updateStatus(app.id, 6)}
>
    Reject
</button>

</td>

                                    </tr>

                                ))

                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
=======
import { useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import ApplicantCard from "../../components/applications/ApplicantCard.jsx";
import Toast from "../../components/Toast.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { updateApplicationStatus } from "../../api/applications.js";

export default function RecruiterApplications() {
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      candidateName: "Kasun Perera",
      matchScore: 92,
      status: "Submitted",
    },
    {
      id: 2,
      candidateName: "Nimal Silva",
      matchScore: 85,
      status: "Submitted",
    },
    {
      id: 3,
      candidateName: "Saman Fernando",
      matchScore: 76,
      status: "Submitted",
    },
  ]);

  const [toast, setToast] = useState("");

  // Stores the applicant selected for rejection
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Controls whether the confirmation modal is visible
  const [showModal, setShowModal] = useState(false);

  async function changeStatus(id, status) {
    const previous = applicants;

    // Optimistic update
    setApplicants(
      applicants.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );

    try {
      await updateApplicationStatus(id, status);

      setToast(`Application ${status}`);
    } catch (error) {
      // Revert if API fails
      setApplicants(previous);

      setToast("Failed to update application");
    }

    setTimeout(() => {
      setToast("");
    }, 3000);
  }

  // Opens confirmation modal
  function rejectApplication(applicant) {
    setSelectedApplicant(applicant);
    setShowModal(true);
  }

  // Called when user clicks Confirm
  function confirmReject() {
    if (selectedApplicant) {
      changeStatus(selectedApplicant.id, "Rejected");
    }

    setShowModal(false);
    setSelectedApplicant(null);
  }

  return (
    <>
      <Navbar />

      <main className="page">
        <h2>Applicants Ranking</h2>

        {applicants
          .sort((a, b) => b.matchScore - a.matchScore)
          .map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onShortlist={() =>
                changeStatus(applicant.id, "Shortlisted")
              }
              onReject={() => rejectApplication(applicant)}
            />
          ))}
      </main>

      <Toast message={toast} />

      <ConfirmModal
        isOpen={showModal}
        title="Reject Application"
        message="Are you sure you want to reject this application?"
        onConfirm={confirmReject}
        onCancel={() => {
          setShowModal(false);
          setSelectedApplicant(null);
        }}
      />
    </>
  );
>>>>>>> dev
}