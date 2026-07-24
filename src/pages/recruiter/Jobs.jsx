import Navbar from '../../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function RecruiterJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
    loadJobs();
}, []);

const loadJobs = async () => {
    try {
        const res = await client.get("/api/jobs/my");
        console.log(res.data.data);
        setJobs(res.data.data);
    } catch (err) {
        console.log(err);
    }
};

const handleDelete = async (id) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {

        await client.delete(`/api/jobs/${id}`);

        alert("Job deleted successfully!");

        loadJobs();

    } catch (err) {

        console.log(err);

        alert(err.response?.data?.message || "Delete failed.");

    }
};


const handleClose = async (id) => {

    const confirmed = window.confirm(
        "Are you sure you want to close this job?"
    );

    if (!confirmed) return;

    try {

        await client.put(`/api/jobs/${id}/close`);

        alert("Job closed successfully!");

        loadJobs();

    } catch (err) {

        console.log(err);

        alert(err.response?.data?.message || "Close failed.");

    }
};

const getStatusClass = (status) => {

    const value = status?.toLowerCase();

    switch (value) {

        case "published":
            return "published";

        case "draft":
            return "draft";

        case "closed":
            return "closed";

        default:
            return "";
    }

};


    return (
        <>
            <Navbar />

            <div className="page">
                <div className="jobs-header">
                    <div>
                        <h1>Recruiter Jobs</h1>
                        <p>Manage your job postings from one place.</p>
                    </div>

                    <button
                    className="new-job-btn"
                    onClick={() => navigate('/recruiter/jobs/new')}>
                        + New Job
                    </button>
                </div>

                <div className="jobs-card">
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Applications</th>
                                <th>Deadline</th>
                                <th style={{ width: "340px" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            
                             {jobs.length === 0 ? (
                                 <tr>
                                     <td colSpan="5" className="empty-row">
                                        No jobs found.
                                     </td>
                                </tr>
                                 ) : (
                                    
                                    jobs.map(job => (
                                    
                                    <tr key={job.id}>
    <td>{job.title}</td>

    <td>{job.location}</td>

    <td>
    <span
        className={`status-badge ${getStatusClass(job.status)}`}
    >
        {job.status}
    </span>
</td>

    <td>
        <strong>{job.applicationCount}</strong>
    </td>

    <td>
        {new Date(job.deadline).toLocaleDateString()}
    </td>

    
    <td>
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap"
        }}
    >
        <button
            className="applications-btn"
            onClick={() =>
                navigate(`/recruiter/jobs/${job.id}/applications`)
            }
        >
            Applications
        </button>

        <button
            className="new-job-btn action-btn"
            onClick={() =>
                navigate(`/recruiter/jobs/${job.id}/edit`)
            }
        >
            Edit
        </button>

        <button
            className="close-btn action-btn"
            onClick={() => handleClose(job.id)}
        >
            Close
        </button>

        <button
            className="delete-btn action-btn"
            onClick={() => handleDelete(job.id)}
        >
            Delete
        </button>
    </div>
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
}