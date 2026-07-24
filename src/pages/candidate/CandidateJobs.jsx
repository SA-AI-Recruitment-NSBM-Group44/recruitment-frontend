import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import client from "../../api/client.js";
import { useNavigate } from "react-router-dom";

export default function CandidateJobs() {

    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [skill, setSkill] = useState("");

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);

    // Loading
    const [loading, setLoading] = useState(true);

    // Pagination
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadJobs();
        loadMyApplications();
    }, [keyword, location, skill, page]);

    async function loadJobs() {

        setLoading(true);

        try {

            const response = await client.get("/api/jobs", {
                params: {
                    keyword,
                    location,
                    skill,
                    page,
                    pageSize
                }
            });

            setJobs(response.data.data.items);
            setTotalCount(response.data.data.totalCount);

        } catch (error) {

            console.error(error);
            alert("Failed to load jobs.");

        } finally {

            setLoading(false);

        }
    }

    async function loadMyApplications() {

        try {

            const response = await client.get("/api/jobapplications/my");

            setAppliedJobs(response.data.map(a => a.jobId));

        } catch (error) {

            console.error(error);

        }

    }

    async function applyJob(jobId) {

        try {

            await client.post("/api/jobapplications/apply", {
                jobId
            });

            alert("Application submitted successfully!");

            setAppliedJobs([...appliedJobs, jobId]);

        } catch (error) {

            console.error(error);

            if (error.response?.data?.message) {

                alert(error.response.data.message);

            } else {

                alert("Failed to apply for job.");

            }

        }

    }

    // Deadline Countdown

    const getDeadlineText = (deadline) => {

        const today = new Date();
        const end = new Date(deadline);

        const diff = Math.ceil(
            (end - today) / (1000 * 60 * 60 * 24)
        );

        if (diff < 0)
            return "🔴 Expired";

        if (diff === 0)
            return "🟠 Today";

        if (diff === 1)
            return "🟡 Tomorrow";

        return `🟢 ${diff} Days Left`;

    };

    return (

        <>
            <Navbar />

            <div className="page">

                <div className="jobs-header">

                    <div>

                        <h1>Available Jobs</h1>

                        <p>Browse jobs and apply.</p>

                    </div>

                </div>

                {/* Search & Filters */}

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        flexWrap: "wrap"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            setPage(1);
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Skill"
                        value={skill}
                        onChange={(e) => {
                            setSkill(e.target.value);
                            setPage(1);
                        }}
                    />

                </div>

                <div className="jobs-card">

                    <table className="jobs-table">

                        <thead>

                            <tr>

                                <th>Job Title</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Salary</th>
                                <th>Deadline</th>
                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td colSpan="6" className="empty-row">

                                        Loading jobs...

                                    </td>

                                </tr>

                            ) : jobs.length === 0 ? (

                                <tr>

                                    <td colSpan="6" className="empty-row">

                                        No jobs available.

                                    </td>

                                </tr>

                            ) : (

                                jobs.map((job) => (

                                    <tr key={job.id}>

                                        <td>{job.title}</td>

                                        <td>{job.location}</td>

                                        <td>{job.status}</td>

                                        <td>

                                            Rs. {job.salaryMin} - Rs. {job.salaryMax}

                                        </td>

                                        <td>

                                            {getDeadlineText(job.deadline)}

                                        </td>

                                        <td>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >

                                                <button
                                                    className="new-job-btn"
                                                    onClick={() =>
                                                        navigate(`/candidate/jobs/${job.id}`)
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className={
                                                        appliedJobs.includes(job.id)
                                                            ? "applied-btn"
                                                            : "new-job-btn"
                                                    }
                                                    disabled={appliedJobs.includes(job.id)}
                                                    onClick={() => applyJob(job.id)}
                                                >

                                                    {appliedJobs.includes(job.id)
                                                        ? "✔ Applied"
                                                        : "Apply"}

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                    {/* Pagination */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "15px",
                            marginTop: "20px"
                        }}
                    >

                        <button
                            className="new-job-btn"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>

                        <strong>

                            Page {page}

                        </strong>

                        <button
                            className="new-job-btn"
                            disabled={page * pageSize >= totalCount}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}