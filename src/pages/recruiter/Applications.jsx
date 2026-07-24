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
}