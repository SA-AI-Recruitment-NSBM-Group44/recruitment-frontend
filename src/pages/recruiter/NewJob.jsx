import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import client from "../../api/client";

export default function NewJob() {
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
    skillIds: ""
});

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

        await client.post("/api/jobs", payload);

        alert("Job created successfully!");

        navigate("/recruiter/jobs");
    }
    catch (err) {
        console.log(err);
        alert(err.response?.data?.message || "Something went wrong");
    }
};
    return (
        <>
            <Navbar />

            <div className="page">
                <div className="jobs-header">
                    <div>
                        <h1>Create New Job</h1>
                        <p>Fill in the job details below.</p>
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
                             placeholder="Software Engineer"
                             />
                        </div>

                        <div className="field">
                            <label>Location</label>
                            <input
                             type="text"
                             name="location"
                             value={form.location}
                             onChange={handleChange}
                             placeholder="Colombo"
                             />
                        </div>

                        <div className="field">
                            <label>Minimum Salary</label>
                            <input
                             type="number"
                             name="salaryMin"
                             value={form.salaryMin}
                             onChange={handleChange}
                             placeholder="50000" />
                        </div>
                        
                        <div className="field">
                            <label>Maximum Salary</label>

                            <input
                            type="number"
                            name="salaryMax"
                            value={form.salaryMax}
                            onChange={handleChange}
                            placeholder="100000"/>
                        </div>

    

                        <div className="field">
                            <label>Application Deadline</label>
                            <input
                             type="date"
                             name="deadline"
                             value={form.deadline}
                             onChange={handleChange} />
                        </div>

                        <div className="field">
                            <label>Description</label>
                            <textarea
                             rows="6"
                             name="description"
                             value={form.description}
                             onChange={handleChange} />
                        </div>

                        <div className="field">
                            <label>Requirements</label>
                            <textarea
                             rows="5"
                             name="requirements"
                             value={form.requirements}
                             onChange={handleChange}
                             placeholder="React, ASP.NET Core, SQL..." />
                        </div>

                        <button type="submit" className="new-job-btn">
                            Save Job
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}