import client from "./client";

// Candidate: Get logged-in user's applications
export async function getMyApplications() {
  const response = await client.get("/api/applications/mine");
  return response.data.data;
}


// Recruiter: Get applicants for a job
export async function getJobApplications(jobId) {
  const response = await client.get(`/api/applications/job/${jobId}`);
  return response.data.data;
}


// Recruiter: Change application status
export async function updateApplicationStatus(id, status) {
  const response = await client.patch(
    `/api/applications/${id}/status`,
    {
      status: status
    }
  );

  return response.data.data;
}