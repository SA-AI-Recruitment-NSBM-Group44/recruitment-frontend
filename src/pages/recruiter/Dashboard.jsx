import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import client from "../../api/client";

export default function RecruiterDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalJobs: 0,
        publishedJobs: 0,
        totalApplications: 0,
        shortlistedCandidates: 0
    });

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            const response = await client.get("/api/jobs/dashboard");
            setStats(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load dashboard statistics.");
        }
    };

    return (
        <>
            <Navbar />

            <div className="page">

                <div className="jobs-header">
                    <div>
                        <h1>Welcome Recruiter 👋</h1>
                        <p>
                            Manage your job postings and recruitment process from one place.
                        </p>
                    </div>
                </div>

                {/* Statistics */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
                        gap: "20px",
                        marginTop: "25px",
                        marginBottom: "30px"
                    }}
                >

                    <div className="jobs-card" style={{ padding: "25px", textAlign: "center" }}>
                        <h3>📋 Total Jobs</h3>
                        <h1 style={{ marginTop: "12px", color: "#4f46e5" }}>
                            {stats.totalJobs}
                        </h1>
                    </div>

                    <div className="jobs-card" style={{ padding: "25px", textAlign: "center" }}>
                        <h3>🌍 Published Jobs</h3>
                        <h1 style={{ marginTop: "12px", color: "#16a34a" }}>
                            {stats.publishedJobs}
                        </h1>
                    </div>

                    <div className="jobs-card" style={{ padding: "25px", textAlign: "center" }}>
                        <h3>📄 Applications</h3>
                        <h1 style={{ marginTop: "12px", color: "#f59e0b" }}>
                            {stats.totalApplications}
                        </h1>
                    </div>

                    <div className="jobs-card" style={{ padding: "25px", textAlign: "center" }}>
                        <h3>⭐ Shortlisted</h3>
                        <h1 style={{ marginTop: "12px", color: "#dc2626" }}>
                            {stats.shortlistedCandidates}
                        </h1>
                    </div>

                </div>

                {/* Actions */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px"
                    }}
                >

                    <div className="jobs-card" style={{ padding: "30px" }}>
                        <h2>📢 Create Job</h2>

                        <p style={{ marginTop: "12px" }}>
                            Publish a new vacancy for candidates.
                        </p>

                        <button
                            className="new-job-btn"
                            style={{ marginTop: "20px" }}
                            onClick={() => navigate("/recruiter/jobs/new")}
                        >
                            Create Job
                        </button>
                    </div>

                    <div className="jobs-card" style={{ padding: "30px" }}>
                        <h2>💼 Manage Jobs</h2>

                        <p style={{ marginTop: "12px" }}>
                            View, edit, close and manage all your job postings.
                        </p>

                        <button
                            className="new-job-btn"
                            style={{ marginTop: "20px" }}
                            onClick={() => navigate("/recruiter/jobs")}
                        >
                            Manage Jobs
                        </button>
                    </div>

                </div>

            </div>
        </>
    );
}