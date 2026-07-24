feature/candidate-profile
import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { toast } from 'react-toastify';

const Profile = () => {
  // 1. Basic Profile Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
  });

  // 2. Skills States
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // 3. UI States
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Initial Data Fetching (Profile Details + Skills List)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch candidate profile and available skills parallelly
        const [profileRes, skillsRes] = await Promise.all([
          client.get('/api/candidates/me'),
          client.get('/api/skills'),
        ]);

        setFormData(profileRes.data);
        setSelectedSkills(profileRes.data.skills || []); 
        setAvailableSkills(skillsRes.data || []);
      } catch (error) {
        toast.error('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Text Field Changes and Clear Field-specific Error
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

  // Add skill to selectedSkills array
  const handleAddSkill = (e) => {
    const skillId = e.target.value;
    if (!skillId) return;

    const skillToAdd = availableSkills.find((s) => s.id.toString() === skillId);

    if (skillToAdd && !selectedSkills.some((s) => s.id === skillToAdd.id)) {
      setSelectedSkills([...selectedSkills, skillToAdd]);
    }

    e.target.value = '';
  };

  // Remove skill from selectedSkills array instantly
  const handleRemoveSkill = (skillIdToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill.id !== skillIdToRemove)
    );
  };

  // Save/PUT Request Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        skills: selectedSkills.map((s) => s.id),
      };

      await client.put('/api/candidates/me', payload);
      toast.success('Profile updated successfully!');
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 422)) {
        setErrors(err.response.data.errors || {});
      } else {
        toast.error('Failed to update profile.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border p-2 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border p-2 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border p-2 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Bio Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border p-2 ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
          )}
        </div>

        {/* Skills Multi-Select Section */}
        <div className="pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <select
            onChange={handleAddSkill}
            className="w-full border border-gray-300 rounded-md p-2 mb-3"
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

          {/* Selected Skills Chips */}
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="text-blue-600 hover:text-blue-900 font-bold ml-1"
                >
                  &times;
                </button>
              </span>
            ))}
            {selectedSkills.length === 0 && (
              <p className="text-sm text-gray-500">No skills selected.</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {submitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;

export default Profile;

﻿
dev
