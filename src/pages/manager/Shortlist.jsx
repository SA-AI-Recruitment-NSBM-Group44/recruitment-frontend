import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import client from '../../api/client.js';
import Toast from '../../components/Toast.jsx';

export default function ManagerShortlist() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  
  // Evaluation modal state
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [score, setScore] = useState(7);
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState('Hire');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const res = await client.get('/api/interviews/mine');
      setInterviews(res.data || []);
    } catch (err) {
      console.error('Failed to fetch interviews for hiring manager:', err);
      showToast('Failed to load candidate shortlist.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const openEvaluationModal = (interview) => {
    setSelectedInterview(interview);
    setScore(7);
    setFeedback('');
    setDecision('Hire');
  };

  const closeEvaluationModal = () => {
    setSelectedInterview(null);
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedInterview) return;

    if (!feedback.trim()) {
      showToast('Please provide feedback remarks for the evaluation.');
      return;
    }

    try {
      setSubmitting(true);
      await client.post('/api/evaluations', {
        interviewId: selectedInterview.id,
        score: Number(score),
        feedback,
        decision
      });

      showToast(`Evaluation recorded with decision: ${decision}!`);
      closeEvaluationModal();
      loadInterviews();
    } catch (err) {
      console.error('Failed to submit evaluation:', err);
      showToast(err.response?.data || 'Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCandidateName = (item) => {
    return (
      item?.application?.candidateProfile?.user?.fullName ||
      item?.application?.candidateProfile?.user?.email ||
      item?.application?.candidateName ||
      'Candidate'
    );
  };

  const getJobTitle = (item) => {
    return item?.application?.jobPosting?.title || 'Target Position';
  };

  // Stat summary counters
  const totalCount = interviews.length;
  const pendingCount = interviews.filter(i => i.application?.status === 'Interviewing' || i.application?.status === 3).length;
  const hiredCount = interviews.filter(i => i.application?.status === 'Hired' || i.application?.status === 4).length;
  const rejectedCount = interviews.filter(i => i.application?.status === 'Rejected' || i.application?.status === 5).length;

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="jobs-header">
          <div>
            <h1>Hiring Manager Dashboard 💼</h1>
            <p>Review shortlisted candidates, evaluate interview feedback, and make final hiring decisions.</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          <div className="jobs-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280' }}>📋 Shortlisted Candidates</h3>
            <h1 style={{ marginTop: '10px', fontSize: '36px', color: '#4f46e5' }}>{totalCount}</h1>
          </div>

          <div className="jobs-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280' }}>⏳ Pending Decision</h3>
            <h1 style={{ marginTop: '10px', fontSize: '36px', color: '#f59e0b' }}>{pendingCount}</h1>
          </div>

          <div className="jobs-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280' }}>✅ Recommended / Hired</h3>
            <h1 style={{ marginTop: '10px', fontSize: '36px', color: '#16a34a' }}>{hiredCount}</h1>
          </div>

          <div className="jobs-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280' }}>❌ Rejected / On Hold</h3>
            <h1 style={{ marginTop: '10px', fontSize: '36px', color: '#dc2626' }}>{rejectedCount}</h1>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="jobs-card">
          <div style={{ padding: '12px 6px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '22px', color: '#111827' }}>Interview & Decision Queue</h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Review candidates scheduled for interview and submit structured evaluation scorecards.</p>
          </div>

          <table className="jobs-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Target Job</th>
                <th>Scheduled Date & Time</th>
                <th>Current Status</th>
                <th>Meeting Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Loading shortlisted candidates...
                  </td>
                </tr>
              ) : interviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No shortlisted candidate interviews assigned yet.
                  </td>
                </tr>
              ) : (
                interviews.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '700', color: '#111827' }}>
                      {getCandidateName(item)}
                    </td>
                    <td style={{ color: '#4f46e5', fontWeight: '600' }}>
                      {getJobTitle(item)}
                    </td>
                    <td>
                      {item.scheduledAt ? new Date(item.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'}
                    </td>
                    <td>
                      <span className="role-badge" style={{ textTransform: 'capitalize' }}>
                        {item.application?.status || 'Scheduled'}
                      </span>
                    </td>
                    <td>
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#2563eb',
                            fontWeight: '600',
                            textDecoration: 'underline',
                            fontSize: '13px'
                          }}
                        >
                          🔗 Join Link
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="applications-btn"
                        onClick={() => openEvaluationModal(item)}
                        style={{
                          padding: '8px 16px',
                          fontSize: '13px'
                        }}
                      >
                        ✍️ Evaluate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluation Modal */}
      {selectedInterview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="jobs-card"
            style={{
              width: '100%',
              maxWidth: '550px',
              backgroundColor: '#ffffff',
              padding: '32px',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#111827' }}>Candidate Evaluation</h2>
              <button
                onClick={closeEvaluationModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>
                Evaluating <strong style={{ color: '#111827' }}>{getCandidateName(selectedInterview)}</strong> for position <strong style={{ color: '#4f46e5' }}>{getJobTitle(selectedInterview)}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitEvaluation} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Score Selector */}
              <div className="field">
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Evaluation Score (1 - 10):</span>
                  <span style={{ color: '#4f46e5', fontWeight: '800' }}>{score} / 10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  style={{ width: '100%', accentColor: '#4f46e5', cursor: 'pointer' }}
                />
              </div>

              {/* Decision Options */}
              <div className="field">
                <label>Hiring Recommendation:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setDecision('Hire')}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: decision === 'Hire' ? '2px solid #16a34a' : '1px solid #e5e7eb',
                      backgroundColor: decision === 'Hire' ? '#f0fdf4' : '#ffffff',
                      color: decision === 'Hire' ? '#15803d' : '#374151',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    🟢 Hire
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('Hold')}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: decision === 'Hold' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                      backgroundColor: decision === 'Hold' ? '#fffbeb' : '#ffffff',
                      color: decision === 'Hold' ? '#b45309' : '#374151',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    🟠 Hold
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('Reject')}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: decision === 'Reject' ? '2px solid #dc2626' : '1px solid #e5e7eb',
                      backgroundColor: decision === 'Reject' ? '#fef2f2' : '#ffffff',
                      color: decision === 'Reject' ? '#b91c1c' : '#374151',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    🔴 Reject
                  </button>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="field">
                <label>Detailed Evaluation Remarks & Feedback:</label>
                <textarea
                  rows="4"
                  placeholder="Enter detailed notes regarding technical performance, soft skills, culture fit..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={closeEvaluationModal}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: 'auto', padding: '12px 24px' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </>
  );
}
