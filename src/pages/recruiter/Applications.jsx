import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import client from "../../api/client";
import Toast from "../../components/Toast.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";

export default function Applications() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await client.get(`/api/jobapplications/job/${id}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await client.put(
        `/api/jobapplications/${applicationId}/status`,
        { status }
      );
      showToast("Application status updated successfully.");
      loadApplications();
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Failed to update application status.");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleRejectClick = (app) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  const confirmReject = () => {
    if (selectedApplication) {
      updateStatus(selectedApplication.id, 5);
    }
    setShowModal(false);
    setSelectedApplication(null);
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
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
                        onClick={() => handleRejectClick(app)}
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

      <Toast message={toast} />

      <ConfirmModal
        isOpen={showModal}
        title="Reject Application"
        message="Are you sure you want to reject this application?"
        onConfirm={confirmReject}
        onCancel={() => {
          setShowModal(false);
          setSelectedApplication(null);
        }}
      />
    </>
  );
}