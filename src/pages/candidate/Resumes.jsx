import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { toast } from 'react-toastify';

// Server-side mirror validation config
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch uploaded resumes on component mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await client.get('/api/candidates/me/resumes');
      setResumes(response.data || []);
    } catch (error) {
      toast.error('Failed to load resumes.');
    } finally {
      setLoading(false);
    }
  };

  // Strict Client-Side File Validation Function
  const validateFile = (file) => {
    if (!file) return false;

    // 1. Extension Check
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext)
    );

    // 2. MIME Type Check
    const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!hasValidExtension || !hasValidMime) {
      toast.error(
        `Invalid file type "${file.name}". Only PDF, DOC, and DOCX files are allowed.`
      );
      return false;
    }

    // 3. File Size Check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`
      );
      return false;
    }

    return true;
  };

  // Upload file logic with Axios progress tracking
  const handleFileUpload = async (file) => {
    // Client-side validation BEFORE sending to server
    if (!validateFile(file)) {
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await client.post('/api/candidates/me/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success('Resume uploaded successfully!');
      fetchResumes(); // Refresh list after upload
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // File Input Handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
    e.target.value = ''; // Reset input to allow selecting the same file again if needed
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Delete Resume Handler
  const handleDelete = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await client.delete(`/api/candidates/me/resumes/${resumeId}`);
      toast.success('Resume deleted successfully!');
      setResumes(resumes.filter((item) => item.id !== resumeId));
    } catch (error) {
      toast.error('Failed to delete resume.');
    }
  };

  if (loading) {
    return <div className="p-4">Loading resumes...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Resumes</h2>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="resumeInput"
          className="hidden"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <label htmlFor="resumeInput" className="cursor-pointer block">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20L28 8z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-gray-600 font-medium">
            Drag & drop your resume here, or{' '}
            <span className="text-blue-600 underline">browse file</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Allowed formats: PDF, DOC, DOCX (Max: {MAX_FILE_SIZE_MB}MB)
          </p>
        </label>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Uploaded Resumes List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Your Uploaded Resumes
        </h3>

        {resumes.length === 0 ? (
          <p className="text-gray-500 text-sm">No resumes uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border rounded-md">
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 font-bold">📄</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {resume.fileName || resume.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded on:{' '}
                      {new Date(
                        resume.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {/* View Button */}
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                  >
                    View
                  </a>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Resumes;

export default Resumes;