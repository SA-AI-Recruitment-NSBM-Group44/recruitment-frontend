import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import client from '../../api/client.js';
import Toast from '../../components/Toast.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, analyticsRes] = await Promise.allSettled([
        client.get(`/api/admin/users?page=${page}&pageSize=${pageSize}`),
        client.get('/api/admin/analytics')
      ]);

      if (usersRes.status === 'fulfilled') {
        const data = usersRes.value.data || {};
        setUsers(data.users || []);
        setTotalCount(data.totalCount || 0);
      }

      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Error loading admin portal data.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleToggleStatusClick = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;
    try {
      const nextStatus = !selectedUser.isActive;
      await client.patch(`/api/admin/users/${selectedUser.id}/status`, {
        isActive: nextStatus
      });
      showToast(`User ${selectedUser.email} ${nextStatus ? 'activated' : 'deactivated'} successfully.`);
      setShowStatusModal(false);
      setSelectedUser(null);
      loadData();
    } catch (err) {
      console.error('Status update failed:', err);
      showToast('Failed to update user status.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const emailMatch = !search || (u.email || '').toLowerCase().includes(search.toLowerCase());
    const roleMatch = roleFilter === 'All' || (u.role || '') === roleFilter;
    return emailMatch && roleMatch;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Compute stat totals
  const totalUsers = analytics?.usersByRole ? analytics.usersByRole.reduce((acc, r) => acc + (r.count || 0), 0) : totalCount;
  const totalJobs = analytics?.totalJobs ?? 0;
  const totalApps = analytics?.applicationsByStatus ? analytics.applicationsByStatus.reduce((acc, a) => acc + (a.count || 0), 0) : 0;

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="jobs-header">
          <div>
            <h1>Administration Portal ⚙️</h1>
            <p>Monitor system performance, review platform analytics, and manage user accounts & access roles.</p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          <div className="jobs-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280' }}>👥 Total Users</h3>
            <h1 style={{ marginTop: '10px', fontSize: '36px', color: '#4f46e5' }}>{totalUsers}</h1>
          </div>

          <div className="jobs-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280' }}>💼 Active Job Postings</h3>
            <h1 style={{ marginTop: '10px', fontSize: '36px', color: '#16a34a' }}>{totalJobs}</h1>
          </div>

          <div className="jobs-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280' }}>📄 Applications Submitted</h3>
            <h1 style={{ marginTop: '10px', fontSize: '36px', color: '#f59e0b' }}>{totalApps}</h1>
          </div>

          <div className="jobs-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280', marginBottom: '12px', textAlign: 'center' }}>🏷️ Users by Role</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {analytics?.usersByRole?.map((r) => (
                <div key={r.role} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#374151' }}>
                  <span style={{ fontWeight: '600' }}>{r.role}</span>
                  <span style={{ fontWeight: '700', color: '#4f46e5' }}>{r.count}</span>
                </div>
              )) || <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Loading...</div>}
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="jobs-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '12px 6px',
              marginBottom: '16px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '22px', color: '#111827' }}>User Management</h2>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Search and manage user role privileges and active account states.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="field" style={{ margin: 0 }}>
                <input
                  type="text"
                  placeholder="🔍 Search by email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ minWidth: '220px', padding: '10px 14px' }}
                />
              </div>

              <div className="field" style={{ margin: 0 }}>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ padding: '10px 14px' }}
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="HiringManager">Hiring Manager</option>
                  <option value="Candidate">Candidate</option>
                </select>
              </div>
            </div>
          </div>

          <table className="jobs-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: '600', color: '#6b7280' }}>#{u.id}</td>
                    <td style={{ fontWeight: '600' }}>{u.email}</td>
                    <td>
                      <span className="role-badge">{u.role}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          backgroundColor: u.isActive ? '#dcfce7' : '#fee2e2',
                          color: u.isActive ? '#15803d' : '#b91c1c'
                        }}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatusClick(u)}
                        style={{
                          background: u.isActive ? '#ef4444' : '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #eef2f7'
            }}
          >
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Showing {filteredUsers.length} of {totalCount} total users (Page {page} of {totalPages})
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="applications-btn"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <button
                className="applications-btn"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{ opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} />

      <ConfirmModal
        isOpen={showStatusModal}
        title={selectedUser?.isActive ? 'Deactivate User Account' : 'Activate User Account'}
        message={`Are you sure you want to ${selectedUser?.isActive ? 'deactivate' : 'activate'} user ${selectedUser?.email}?`}
        onConfirm={confirmToggleStatus}
        onCancel={() => {
          setShowStatusModal(false);
          setSelectedUser(null);
        }}
      />
    </>
  );
}
