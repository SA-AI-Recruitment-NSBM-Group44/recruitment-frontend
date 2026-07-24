import Navbar from "../../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

export default function CandidateDashboard() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />

            <div className="page">

                <div className="jobs-header">
                    <div>
                        <h1>Welcome Candidate 👋</h1>

                        <p>
                            Search jobs and manage your applications.
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "20px",
                        marginTop: "30px"
                    }}
                >

                    <div className="jobs-card" style={{ padding: "30px" }}>

                        <h2>🔍 Browse Jobs</h2>

                        <p style={{ marginTop: "12px" }}>
                            Find and apply for available jobs.
                        </p>

                        <button
                            className="new-job-btn"
                            style={{ marginTop: "20px" }}
                            onClick={() => navigate("/candidate/jobs")}
                        >
                            Browse Jobs
                        </button>

                    </div>

                    <div className="jobs-card" style={{ padding: "30px" }}>

                        <h2>📄 My Applications</h2>

                        <p style={{ marginTop: "12px" }}>
                            View all jobs you have applied for.
                        </p>

                        <button
                            className="new-job-btn"
                            style={{ marginTop: "20px" }}
                            onClick={() => navigate("/candidate/applications")}
                        >
                            My Applications
                        </button>

                    </div>

                </div>

            </div>
        </>
    );
}