import React, { useState, useEffect } from 'react';
import client from '../../api/client';

export default function Profile() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
  });

  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, skillsRes] = await Promise.all([
          client.get('/api/candidates/me').catch(() => ({ data: {} })),
          client.get('/api/skills').catch(() => ({ data: [] })),
        ]);

        setFormData(profileRes.data || {});
        setSelectedSkills(profileRes.data?.skills || []);
        setAvailableSkills(skillsRes.data || []);
      } catch (error) {
        console.error('Failed to load profile data.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleAddSkill = (e) => {
    const skillId = e.target.value;
    if (!skillId) return;

    const skillToAdd = availableSkills.find((s) => s.id.toString() === skillId);
    if (skillToAdd && !selectedSkills.some((s) => s.id === skillToAdd.id)) {
      setSelectedSkills([...selectedSkills, skillToAdd]);
    }
    e.target.value = '';
  };

  const handleRemoveSkill = (skillIdToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill.id !== skillIdToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    setMessage('');

    try {
      const payload = {
        ...formData,
        skills: selectedSkills.map((s) => s.id),
      };

      await client.put('/api/candidates/me', payload);
      setMessage('Profile updated successfully!');
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 422)) {
        setErrors(err.response.data.errors || {});
      } else {
        setMessage('Failed to update profile.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page">Loading profile...</div>;
  }

  return (
    <div className="page" style={{ maxWidth: '700px', margin: 'auto', padding: '30px' }}>
      <div className="jobs-card" style={{ padding: '30px' }}>
        <h2>Edit Profile</h2>

        {message && (
          <div style={{ margin: '15px 0', padding: '10px', background: '#e0e7ff', color: '#3730a3', borderRadius: '8px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            {errors.fullName && <p style={{ color: 'red', fontSize: '13px' }}>{errors.fullName}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            {errors.email && <p style={{ color: 'red', fontSize: '13px' }}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            {errors.phone && <p style={{ color: 'red', fontSize: '13px' }}>{errors.phone}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            {errors.bio && <p style={{ color: 'red', fontSize: '13px' }}>{errors.bio}</p>}
          </div>

          <div style={{ paddingTop: '15px', borderTop: '1px solid #eee' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Skills</label>
            <select
              onChange={handleAddSkill}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px' }}
              defaultValue=""
            >
              <option value="" disabled>
                -- Select a skill to add --
              </option>
              {availableSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="chip"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveSkill(skill.id)}
                >
                  {skill.name} &times;
                </span>
              ))}
              {selectedSkills.length === 0 && (
                <p style={{ color: '#888', fontSize: '14px' }}>No skills selected.</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="new-job-btn"
            style={{ marginTop: '20px' }}
          >
            {submitting ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
