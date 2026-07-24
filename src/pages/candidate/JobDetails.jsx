import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import client from "../../api/client";

export default function JobDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJob();
    }, []);

    const loadJob = async () => {

        try {

            const res = await client.get(`/api/jobs/${id}`);

            setJob(res.data.data);

        } catch (err) {

            console.log(err);
            alert("Failed to load job.");

        } finally {

            setLoading(false);

        }

    };

    const applyJob = async () => {

        try {

            await client.post("/api/jobapplications/apply", {
                jobId: job.id
            });

            alert("Application submitted successfully!");

            navigate("/candidate/applications");

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ??
                "Failed to apply."
            );

        }

    };

    if (loading) {

        return (
            <>
                <Navbar />
                <div className="page">
                    <h2>Loading job...</h2>
                </div>
            </>
        );

    }

    if (!job) {

        return (
            <>
                <Navbar />
                <div className="page">
                    <h2>Job not found.</h2>
                </div>
            </>
        );

    }

    return (

        <>
            <Navbar />

            <div className="page">

                <div className="jobs-card">

                    <h1>{job.title}</h1>

                    <hr />

                    <p>
                        <strong>Location :</strong> {job.location}
                    </p>

                    <p>
                        <strong>Status :</strong> {job.status}
                    </p>

                    <p>
                        <strong>Salary :</strong>

                        {" "}
                        Rs. {job.salaryMin} - Rs. {job.salaryMax}
                    </p>

                    <p>
                        <strong>Deadline :</strong>

                        {" "}
                        {new Date(job.deadline).toLocaleDateString()}
                    </p>

                    <br />

                    <h3>Description</h3>

                    <p>{job.description}</p>

                    <br />

                    <h3>Requirements</h3>

                    <p>{job.requirements}</p>

                    <br />

                    <h3>Skills</h3>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap"
                        }}
                    >
                        {job.skills.map(skill => (

                            <span
                                key={skill}
                                className="status-badge"
                            >
                                {skill}
                            </span>

                        ))}
                    </div>

                    <br />

                    <button
                        className="new-job-btn"
                        onClick={applyJob}
                    >
                        Apply Now
                    </button>

                </div>

            </div>

        </>

    );

}