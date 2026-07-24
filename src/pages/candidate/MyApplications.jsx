import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import client from "../../api/client.js";

export default function MyApplications() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        loadApplications();
    }, []);

    async function loadApplications() {
        try {
            const response = await client.get("/api/jobapplications/my");
            setApplications(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load applications.");
        }
    }

    return (
        <>
            <Navbar />

            <div className="page">
                <div className="jobs-header">
                    <div>
                        <h1>My Applications</h1>
                        <p>Track the jobs you have applied for.</p>
                    </div>
                </div>

                <div className="jobs-card">
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="3">
                                        No applications found.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((application) => (
                                    <tr key={application.id}>
                                        <td>{application.jobTitle}</td>

                                        <td>
                                            {new Date(
                                                application.appliedAt
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            <span
                                            className={`status-badge ${application.status
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                                >
                                                    {application.status}
                                            </span>
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