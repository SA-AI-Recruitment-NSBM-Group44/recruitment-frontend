import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import client from "../../api/client";

export default function EditJob() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        deadline: "",
        status: "Draft",
        skillIds: []
    });

    useEffect(() => {
        loadJob();
    }, []);

    const loadJob = async () => {
        try {

            const res = await client.get(`/api/jobs/${id}`);

            const job = res.data.data;

            setForm({
                title: job.title,
                description: job.description,
                requirements: job.requirements ?? "",
                location: job.location ?? "",
                salaryMin: job.salaryMin ?? "",
                salaryMax: job.salaryMax ?? "",
                deadline: job.deadline.split("T")[0],
                status: job.status,
                skillIds: []
            });

        } catch (err) {
            console.log(err);
            alert("Cannot load job.");
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const payload = {
            title: form.title,
            description: form.description,
            requirements: form.requirements,
            location: form.location,
            salaryMin: Number(form.salaryMin),
            salaryMax: Number(form.salaryMax),
            deadline: form.deadline,
            status: form.status,
            skillIds: []
        };

        await client.put(`/api/jobs/${id}`, payload);

        alert("Job updated successfully!");

        navigate("/recruiter/jobs");

    } catch (err) {

        console.log(err);

        alert(err.response?.data?.message || "Update failed.");

    }
};

    return (
        <>
            <Navbar />

            <div className="page">

                <div className="jobs-header">
                    <div>
                        <h1>Edit Job</h1>
                        <p>Update your job details.</p>
                    </div>
                </div>

                <div className="jobs-card">

                    <form className="job-form" onSubmit={handleSubmit}>

                        <div className="field">
                            <label>Job Title</label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label>Minimum Salary</label>

                            <input
                                type="number"
                                name="salaryMin"
                                value={form.salaryMin}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label>Maximum Salary</label>

                            <input
                                type="number"
                                name="salaryMax"
                                value={form.salaryMax}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label>Application Deadline</label>

                            <input
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label>Description</label>

                            <textarea
                                rows="6"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label>Requirements</label>

                            <textarea
                                rows="4"
                                name="requirements"
                                value={form.requirements}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                        type="submit"
                        className="new-job-btn"
                        >
                            Save Changes
                        </button>

                    </form>

                </div>

            </div>

        </>
    );
}