 feature/candidate-profile
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import client from '../../api/client';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState({
        applicationsCount: 0,
        latestRecommendation: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);

                const appsRes = await client.get('/api/candidates/me/applications').catch(() => ({ data: [] }));
                const recsRes = await client.get('/api/candidates/me/recommendations').catch(() => ({ data: [] }));

                setStats({
                    applicationsCount: Array.isArray(appsRes.data) ? appsRes.data.length : (appsRes.data?.count || 0),
                    latestRecommendation: Array.isArray(recsRes.data) ? recsRes.data[0] : recsRes.data || null,
                });
            } catch (error) {
                toast.error('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const getGreetingTime = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return <div className="page" style={{ padding: '40px 24px', color: 'var(--ink-soft)' }}>Loading dashboard...</div>;
    }

    return (
        <div className="page" style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px' }}>

            {/* Greeting Header */}
            <div
                style={{
                    background: 'var(--card, #ffffff)',
                    padding: '32px',
                    borderRadius: 'var(--radius, 12px)',
                    border: '1px solid var(--line, #e4e7ef)',
                    marginBottom: '24px',
                    boxShadow: '0 4px 12px rgba(16, 24, 40, 0.03)'
                }}
            >
                <h1 style={{ fontSize: '30px', fontWeight: '700', color: 'var(--ink, #101828)', margin: '0 0 8px 0' }}>
                    {getGreetingTime()}, {user?.name || user?.fullName || 'Candidate'}! 👋
                </h1>
                <p style={{ color: 'var(--ink-soft, #475467)', fontSize: '15px', lineHeight: '1.5', margin: 0 }}>
                    Welcome back to your job portal dashboard. Manage your profile, CVs, and view job recommendations below.
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                    marginBottom: '24px'
                }}
            >
                {/* Stat Card 1: Applications Count */}
                <div
                    style={{
                        background: 'var(--card, #ffffff)',
                        padding: '28px',
                        borderRadius: 'var(--radius, 12px)',
                        border: '1px solid var(--line, #e4e7ef)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 12px rgba(16, 24, 40, 0.03)'
                    }}
                >
                    <div>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink-soft, #475467)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                            TOTAL APPLICATIONS
                        </p>
                        <h3 style={{ fontSize: '38px', fontWeight: '700', color: 'var(--ink, #101828)', margin: '6px 0 4px 0' }}>
                            {stats.applicationsCount}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#98a2b3', margin: 0 }}>
                            * Awaiting live sync from Applications API
                        </p>
                    </div>
                    <div
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            background: '#eef2ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '26px'
                        }}
                    >
                        📋
                    </div>
                </div>

                {/* Stat Card 2: Recommendation Status */}
                <div
                    style={{
                        background: 'var(--card, #ffffff)',
                        padding: '28px',
                        borderRadius: 'var(--radius, 12px)',
                        border: '1px solid var(--line, #e4e7ef)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 12px rgba(16, 24, 40, 0.03)'
                    }}
                >
                    <div>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink-soft, #475467)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                            LATEST RECOMMENDATION
                        </p>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink, #101828)', margin: '12px 0 4px 0' }}>
                            {stats.latestRecommendation?.jobTitle || 'No active matches'}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#98a2b3', margin: 0 }}>
                            * Awaiting live sync from Recommendations API
                        </p>
                    </div>
                    <div
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            background: '#ecfdf5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '26px'
                        }}
                    >
                        🎯
                    </div>
                </div>
            </div>

            {/* Top Recommendation Spotlight */}
            <div
                style={{
                    background: 'var(--card, #ffffff)',
                    padding: '32px',
                    borderRadius: 'var(--radius, 12px)',
                    border: '1px solid var(--line, #e4e7ef)',
                    boxShadow: '0 4px 12px rgba(16, 24, 40, 0.03)'
                }}
            >
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink, #101828)', margin: '0 0 20px 0' }}>
                    Top Job Recommendation
                </h3>

                {stats.latestRecommendation ? (
                    <div
                        style={{
                            padding: '20px 24px',
                            border: '1px solid #c7d2fe',
                            background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
                            borderRadius: '10px'
                        }}
                    >
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary-deep, #3730a3)', margin: '0 0 6px 0' }}>
                            {stats.latestRecommendation.jobTitle || 'Software Engineer'}
                        </h4>
                        <p style={{ fontSize: '14px', color: 'var(--ink-soft, #475467)', margin: 0 }}>
                            {stats.latestRecommendation.companyName || 'Recommended based on your profile skills'}
                        </p>
                        <div style={{ marginTop: '14px' }}>
                            <span
                                style={{
                                    display: 'inline-block',
                                    background: 'var(--primary, #4f46e5)',
                                    color: '#ffffff',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    padding: '5px 14px',
                                    borderRadius: '999px'
                                }}
                            >
                                Match Score: {stats.latestRecommendation.matchScore || 'N/A'}%
                            </span>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '48px 20px',
                            border: '1.5px dashed var(--line, #e4e7ef)',
                            borderRadius: '10px',
                            color: 'var(--ink-soft, #475467)',
                            fontSize: '14px',
                            background: 'var(--paper, #f7f8fc)'
                        }}
                    >
                        No recommendations generated yet. Complete your profile & skills to get AI-matched job roles.
                    </div>
                )}

                {/* Footer Credit */}
                <div
                    style={{
                        fontSize: '12px',
                        color: 'var(--ink-soft, #475467)',
                        textAlign: 'right',
                        marginTop: '24px',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--line, #e4e7ef)',
                        opacity: 0.8
                    }}
                >
                    Module Owners: Chamudi (profile + CVs) · Dimuthu (recommendations)
                </div>
            </div>

        </div>
    );
};

export default Dashboard;

 HEAD
import { Link } from 'react-router-dom';
import Placeholder from '../../components/Placeholder.jsx';

export default function CandidateDashboard() {
  return (
    <div>

      <Placeholder
        title="Candidate dashboard"
        description="Profile editor, CV manager and AI job recommendations land here."
        owner="Chamudi (profile + CVs) · Dimuthu (recommendations)"
      />


      <div className="recommend-button-container">

        <Link to="/candidate/recommendations">

          <button className="recommend-button">

            🤖 View AI Recommendations

          </button>

        </Link>

      </div>


    </div>
  );

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
f8f41e311d4b48a07ea3678ce7fceb3d53c90b43
}
dev
