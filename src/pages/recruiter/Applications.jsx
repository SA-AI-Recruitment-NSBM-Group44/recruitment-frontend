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
}