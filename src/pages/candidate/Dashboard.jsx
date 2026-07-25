import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import client from "../../api/client.js";
import Navbar from "../../components/Navbar.jsx";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    applicationsCount: 0,
    latestRecommendation: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const apps = await client
          .get("/api/candidates/me/applications")
          .catch(() => ({ data: [] }));

        const recommendations = await client
          .get("/api/candidates/me/recommendations")
          .catch(() => ({ data: [] }));

        setStats({
          applicationsCount: Array.isArray(apps.data) ? apps.data.length : 0,
          latestRecommendation: Array.isArray(recommendations.data)
            ? recommendations.data[0]
            : recommendations.data,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page">Loading dashboard...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="jobs-header">
          <div>
            <h1>Welcome {user?.name || "Candidate"} 👋</h1>
            <p>Manage your profile, applications and AI job recommendations.</p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div className="jobs-card" style={{ padding: "25px" }}>
            <h2>📄 My Applications</h2>
            <p style={{ margin: "10px 0" }}>
              Total Applications: <strong>{stats.applicationsCount}</strong>
            </p>
            <button
              className="new-job-btn"
              onClick={() => navigate("/candidate/applications")}
            >
              View Applications
            </button>
          </div>

          <div className="jobs-card" style={{ padding: "25px" }}>
            <h2>🤖 AI Recommendation</h2>
            <p style={{ margin: "10px 0" }}>
              {stats.latestRecommendation
                ? stats.latestRecommendation.jobTitle
                : "No recommendations available"}
            </p>
            <Link to="/candidate/recommendations">
              <button className="new-job-btn">
                View AI Recommendations
              </button>
            </Link>
          </div>

          <div className="jobs-card" style={{ padding: "25px" }}>
            <h2>🔍 Browse Jobs</h2>
            <p style={{ margin: "10px 0" }}>Find suitable jobs and apply.</p>
            <button
              className="new-job-btn"
              onClick={() => navigate("/candidate/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        </div>

        <div
          className="jobs-card"
          style={{
            marginTop: "30px",
            padding: "30px",
          }}
        >
          <h2>🎯 Top Recommendation</h2>
          {stats.latestRecommendation ? (
            <div style={{ marginTop: "15px" }}>
              <h3>
                {stats.latestRecommendation.jobTitle || "Recommended Job"}
              </h3>
              <p style={{ color: "#666", margin: "5px 0" }}>
                {stats.latestRecommendation.companyName || "Based on your skills"}
              </p>
              <span style={{ fontWeight: "bold", color: "#4f46e5" }}>
                Match Score: {stats.latestRecommendation.matchScore || "N/A"}%
              </span>
            </div>
          ) : (
            <p style={{ marginTop: "10px", color: "#666" }}>
              Complete your profile to receive AI matched jobs.
            </p>
          )}
        </div>
      </div>
    </>
  );
}